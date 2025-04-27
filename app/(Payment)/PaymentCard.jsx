import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import API_BASE_URL from '../../server/api.config';

export default function PaymentScreen({ route, navigation }) {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // You could receive these from route params in a real app
  const { itemId = 'dd', itemName = 'dd', amount = 1000, firebaseUID = 'dd' } = route?.params || {};

  // Format the amount for display (amount is in cents)
  const formattedAmount = `$${(amount / 100).toFixed(2)}`;

  const handlePayPress = async () => {
    // Check if all card details are provided
    if (!cardDetails?.number) {
      setError('Please enter the card number');
      return;
    }
    if (!cardDetails?.expiry) {
      setError('Please enter the expiry date');
      return;
    }
    if (!cardDetails?.cvc) {
      setError('Please enter the CVC');
      return;
    }
    if (!cardDetails?.complete) {
      setError('Please enter complete card details');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the createAndSavePayment endpoint
      const response = await fetch(`${API_BASE_URL}/payment/intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          FirebaseUID: firebaseUID,
          ItemID: itemId,
          ItemName: itemName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment');
      }

      const { clientSecret, payment } = await response.json();

      if (!clientSecret) {
        throw new Error('Failed to retrieve client secret');
      }

      const { paymentIntent, error: paymentError } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (paymentError) {
        setError(paymentError.message);
      } else if (paymentIntent) {
        console.log('Payment successful!', paymentIntent);

        // Navigate to success screen or show success message
        // navigation.navigate('PaymentSuccess', { 
        //   paymentId: payment.PaymentID,
        //   amount: formattedAmount
        // });
      }
    } catch (e) {
      setError(e.message || 'An error occurred processing your payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Payment</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>Item:</Text>
        <Text style={styles.detailsValue}>{itemName}</Text>

        <Text style={styles.detailsLabel}>Price:</Text>
        <Text style={styles.detailsValue}>{formattedAmount}</Text>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.label}>Card Information</Text>
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.cardFieldStyle}
          onCardChange={(cardDetails) => {
            console.log('Card details:', cardDetails); // Debugging card details
            setCardDetails(cardDetails); // Update state with card details
            if (error) setError(null); // Clear previous error
          }}
          style={styles.cardField}
        />
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <View style={styles.secureContainer}>
        <Text style={styles.secureText}>🔒 Secure payment powered by Stripe</Text>
      </View>

      <TouchableOpacity
        style={[styles.payButton, cardDetails?.complete && styles.payButtonDisabled]}
        onPress={handlePayPress}
        disabled={cardDetails?.complete || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.payButtonText}>{`Pay ${formattedAmount}`}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F0F1A',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#fff',
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 20,
  },
  detailsLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 12,
  },
  cardField: {
    width: '100%',
    height: 50,
  },
  cardFieldStyle: {
    backgroundColor: '#FFFFFF',
    textColor: '#1A1A1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  errorText: {
    color: '#E25950',
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  secureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  secureText: {
    color: '#888',
    fontSize: 14,
  },
  payButton: {
    backgroundColor: '#5469D4',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonDisabled: {
    backgroundColor: '#B2BAD4',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
