import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../../server/api.config';

const PaymentCard = () => {
  const params = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  
  // Prevent multiple initializations
  const initializationRef = useRef(false);
  const isInitializingRef = useRef(false);

  // Check login status and get Firebase UID
  useEffect(() => {
    const checkLoginAndGetUid = async () => {
      try {
        setIsCheckingLogin(true);
        
        // Get user ID from AsyncStorage
        const storedUserId = await AsyncStorage.getItem('firebaseUid');
        
        if (!storedUserId) {
          console.log('No user ID found in storage');
          Alert.alert(
            'Login Required',
            'Please log in to complete your payment',
            [
              {
                text: 'Cancel',
                onPress: () => router.back(),
                style: 'cancel',
              },
              {
                text: 'Go to Login',
                onPress: () => router.replace('/sign-in'),
              },
            ]
          );
          return;
        }
        
        setFirebaseUid(storedUserId);
        
      } catch (error) {
        console.error('Error retrieving Firebase UID:', error);
        Alert.alert(
          'Error',
          'Failed to retrieve user information. Please try again.'
        );
      } finally {
        setIsCheckingLogin(false);
      }
    };

    checkLoginAndGetUid();
  }, []);

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
          quantity: params.quantity?.toString() || '1',
          userId: firebaseUid || '' // Add Firebase UID to metadata
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

    if (!firebaseUid) {
      console.log('Firebase UID not available yet, waiting...');
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
    if (!ready || !firebaseUid) {
      if (!firebaseUid) {
        Alert.alert('Error', 'User authentication required. Please log in again.');
      }
      return;
    }

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
            userId: firebaseUid, // Use Firebase UID instead of hardcoded value
            itemId: params.itemId?.toString() || '',
            amount: parseFloat(params.total) || 0,
            currency: 'lkr',
            paymentIntentId: paymentIntentId,
            status: 'succeeded'
          })
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          console.error('Save payment error:', errorData);
          throw new Error(errorData.error || 'Failed to save payment details');
        }
        
        const saveData = await saveResponse.json();
        
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

  // Initialize payment sheet when Firebase UID is available
  useEffect(() => {
    if (params.total && params.itemId && firebaseUid && !initializationRef.current && !isInitializingRef.current && !isCheckingLogin) {
      initializePaymentSheet();
    } else if (initializationRef.current) {
      // Already initialized
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
  }, [firebaseUid, isCheckingLogin]); // Add firebaseUid and isCheckingLogin as dependencies

  const formatAmount = (amount) => {
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Show loading while checking login status
  if (isCheckingLogin) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Checking authentication...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="payment" size={32} color="#4F46E5" />
        </View>
        <Text style={styles.title}>Complete Your Payment</Text>
        <Text style={styles.description}>
          Secure payment powered by Stripe
        </Text>
      </View>

      {/* Amount Section */}
      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.currency}>LKR</Text>
          <Text style={styles.amount}>{formatAmount(params.total)}</Text>
        </View>
        <View style={styles.divider} />
      </View>

      {/* Payment Button Section */}
      <View style={styles.buttonSection}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.loadingText}>
                {ready ? 'Processing payment...' : 'Setting up payment...'}
              </Text>
              <View style={styles.loadingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.payButton, !ready && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={!ready || !firebaseUid}
            activeOpacity={0.8}
          >
            <View style={[styles.payButtonGradient, (!ready || !firebaseUid) && styles.payButtonGradientDisabled]}>
              <View style={styles.payButtonContent}>
                <MaterialIcons 
                  name="lock" 
                  size={20} 
                  color="#FFFFFF" 
                  style={styles.lockIcon} 
                />
                <Text style={styles.payButtonText}>
                  {ready && firebaseUid ? 'Pay Securely' : 'Preparing...'}
                </Text>
                <MaterialIcons 
                  name="arrow-forward" 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Security Footer */}
      <View style={styles.securityFooter}>
        <View style={styles.securityBadge}>
          <MaterialIcons name="security" size={16} color="#10B981" />
          <Text style={styles.securityText}>256-bit SSL encryption</Text>
        </View>
        <Text style={styles.footerText}>
          Your payment information is secure and encrypted
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    padding: 24,
  },
  
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    color: '#9CA3AF',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },

  // Amount Section
  amountSection: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  amountLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currency: {
    color: '#D1D5DB',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(75, 85, 99, 0.3)',
    marginHorizontal: 16,
  },

  // Button Section
  buttonSection: {
    marginBottom: 32,
  },
  payButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  payButtonDisabled: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  payButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: '#4F46E5',
  },
  payButtonGradientDisabled: {
    backgroundColor: '#6B7280',
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    marginRight: 12,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Loading States
  loadingContainer: {
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    minWidth: 200,
  },
  loadingText: {
    color: '#D1D5DB',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 0.3,
  },

  // Security Footer
  securityFooter: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 24,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  securityText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PaymentCard;