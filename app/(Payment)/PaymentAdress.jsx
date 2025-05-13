import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import icons from '../../constants/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';

const PaymentAddress = () => {
  const params = useLocalSearchParams();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);

  // Get the itemId from route params
  const itemId = params?.itemId;
  
  // Check login status and fetch user data on component mount
  useEffect(() => {
    const checkLoginAndFetchData = async () => {
      try {
        setIsCheckingLogin(true);
        
        // Get user ID from AsyncStorage
        const storedUserId = await AsyncStorage.getItem('firebaseUid');
        
        if (!storedUserId) {
          console.log('No user ID found in storage');
          Alert.alert(
            'Login Required',
            'Please log in to manage your payment address',
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
        
        // Fetch user data using the ID
        const response = await axios.get(`${API_BASE_URL}/user/${storedUserId}`);
        const userData = response.data;
        
        if (userData) {
          setPhoneNumber(userData.phoneNumber || '');
          setAddress1(userData.address1 || '');
          setAddress2(userData.address2 || '');
          setPostalCode(userData.postalCode || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        console.log('Error response:', error.response);
        Alert.alert(
          'Error',
          'Failed to load your address information. Please try again later.'
        );
      } finally {
        setIsCheckingLogin(false);
      }
    };

    checkLoginAndFetchData();
  }, []);

  const handleSave = async () => {
    // First, check if firebaseUid exists
    if (!firebaseUid) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare data to update
      const userData = {
        phoneNumber,
        address1,
        address2,
        postalCode
      };
  
      // Make API call to update user data
      const response = await axios.put(
        `${API_BASE_URL}/user/${firebaseUid}`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.status === 200) {
        Alert.alert('Success', 'Payment address updated successfully');
        
        // Navigate to ItemCheckout with the itemId from params
        if (itemId) {
          router.push({
            pathname: '/(Payment)/ItemCheckout',
            params: { itemId: itemId }
          });
        } else {
          router.back();
        }
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      console.log('Error response:', error.response);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update payment address'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Show loading or login required message
  if (isCheckingLogin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show form only if user is logged in
  if (!firebaseUid) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Login required to access this page</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Address</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address Line 1</Text>
                <TextInput
                  style={styles.input}
                  value={address1}
                  onChangeText={setAddress1}
                  placeholder="Enter street address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address Line 2</Text>
                <TextInput
                  style={styles.input}
                  value={address2}
                  onChangeText={setAddress2}
                  placeholder="Enter Street Address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Postal Code</Text>
                <TextInput
                  style={styles.input}
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="Enter postal code"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>SET AS DEFAULT</Text>
                <Switch
                  value={isDefault}
                  onValueChange={setIsDefault}
                  trackColor={{ false: '#D1D1D6', true: '#99A9FF' }}
                  thumbColor={isDefault ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>

              <TouchableOpacity 
                style={[styles.saveButton, isLoading && styles.disabledButton]} 
                onPress={handleSave}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? 'Saving...' : 'Save Address'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 30,
   
    
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
    marginTop:30
  },
  formContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: 'white',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 45,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  toggleLabel: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#1F3B8B',
    borderRadius: 6,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 0,  // Add some bottom margin for scrolling space
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  disabledButton: {
    backgroundColor: '#1F3B8B80',
  }
});

export default PaymentAddress;