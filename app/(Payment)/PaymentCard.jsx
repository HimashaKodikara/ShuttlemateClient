import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import API_BASE_URL from '../../server/api.config';

const PaymentCard = () => {
  const params = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  
  // Prevent multiple initializations
  const initializationRef = useRef(false);
  const isInitializingRef = useRef(false);

  const fetchPaymentSheetParams = async () => {
    try {
    

      const totalAmount = parseFloat(params.total) || 0;
      if (totalAmount <= 0) {
        throw new Error(`Invalid payment amount: ${params.total}`);
      }

      const requestBody = {
        amount: Math.round(totalAmount * 100),
        currency: 'lkr',
        metadata: { 
          itemId: params.itemId?.toString() || '', 
          quantity: params.quantity?.toString() || '1' 
        }
      };

     
      const response = await fetch(`${API_BASE_URL}/payment/create-payment-intent`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          const textError = await response.text();
          console.log('Error response text:', textError);
          errorMessage = textError || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error('No client secret received from server');
      }
      
      return {
        paymentIntent: data.clientSecret,
        paymentIntentId: data.paymentIntentId
      };
    } catch (error) {
      console.error('Detailed error in fetchPaymentSheetParams:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause
      });
      
      if (error.message.includes('Network request failed') || 
          error.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      }
      
      if (error.message.includes('HTTP 5')) {
        throw new Error('Server error occurred. Please try again later.');
      }
      
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    if (isInitializingRef.current || initializationRef.current) {
      return;
    }

    isInitializingRef.current = true;
    setLoading(true);
    
    try {
      const { paymentIntent, paymentIntentId } = await fetchPaymentSheetParams();

      const initConfig = {
        merchantDisplayName: "Shuttlemate",
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: {
          name: 'Customer Name',
        },
        allowsDelayedPaymentMethods: false,
      };

      

      const { error } = await initPaymentSheet(initConfig);

      if (error) {
        console.error('Payment sheet initialization error:', {
          code: error.code,
          message: error.message,
          type: error.type,
          localizedMessage: error.localizedMessage
        });
        Alert.alert('Payment Setup Error', error.localizedMessage || error.message);
        initializationRef.current = false; 
      } else {
        setReady(true);
        setPaymentIntentId(paymentIntentId);
        initializationRef.current = true; 
      }
    } catch (err) {
      console.error('Payment sheet initialization error:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      Alert.alert('Payment Setup Failed', err.message || 'Failed to initialize payment. Please try again.');
      initializationRef.current = false; 
    } finally {
      setLoading(false);
      isInitializingRef.current = false;
    }
  };

  const handlePayment = async () => {
    if (!ready) return;

    setLoading(true);
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error('Payment error:', error);
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      try {
        const saveResponse = await fetch(`${API_BASE_URL}/payment/save-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'USER_ID',
            itemId: params.itemId?.toString() || '',
            amount: parseFloat(params.total) || 0,
            currency: 'lkr',
            paymentIntentId: paymentIntentId,
            status: 'succeeded'
          })
        });

        if (!saveResponse.ok) {
          throw new Error('Failed to save payment details');
        }
        
        Alert.alert('Success', 'Your payment is confirmed!', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/shop')
          }
        ]);
      } catch (err) {
        console.error('Error saving payment:', err);
        Alert.alert('Payment Successful', 'Your payment went through successfully!', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/shop')
          }
        ]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    
    if (params.total && params.itemId && !initializationRef.current && !isInitializingRef.current) {
      initializePaymentSheet();
    } else if (initializationRef.current) {
    } else if (!params.total || !params.itemId) {
      console.error('Missing required parameters:', {
        total: params.total,
        itemId: params.itemId,
        quantity: params.quantity
      });
      Alert.alert('Error', 'Missing payment information. Please go back and try again.', [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]);
    }
  }, []); 

  useEffect(() => {
  }, [params.total, params.itemId, params.quantity]); 

  const formatAmount = (amount) => {
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Payment</Text>
      <Text style={styles.subtitle}>
        Total: LKR {formatAmount(params.total)}
      </Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F3B8B" />
          <Text style={styles.loadingText}>
            {ready ? 'Processing payment...' : 'Setting up payment...'}
          </Text>
        </View>
      ) : (
        <Button 
          title="Pay Now" 
          onPress={handlePayment} 
          disabled={!ready}
          color="#1F3B8B"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 12,
    fontSize: 16,
  },
});

export default PaymentCard;