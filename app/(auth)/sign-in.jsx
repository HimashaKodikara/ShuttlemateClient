import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../constants/images.js'
import logo from '../../constants/icons.js';
import { router } from 'expo-router';
import { getAuth, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from '@react-native-firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import icons from '../../constants/icons.js';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config.js';

WebBrowser.maybeCompleteAuthSession();

// Initialize Firebase Auth
const auth = getAuth();

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);

  useEffect(() => {
    const setLoginTimestamp = async () => {
      await AsyncStorage.setItem('loginTimestamp', Date.now().toString());
    };
    setLoginTimestamp();
  }, []);
  
  // Set up Google OAuth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: '902062135902-u2gdc6rsgu4fkip7oljqttnam1fj9so0.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithGoogle(credential);
    }
  }, [response]);

  const fetchUserDataAndStoreUserId = async (userEmail) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user?email=${userEmail}`);
      
      if (response.data && response.data.length > 0) {
        const userData = response.data[0];
        
        // Store both Firebase UID and MongoDB ID
        await AsyncStorage.setItem('userId', userData._id);
        await AsyncStorage.setItem('firebaseUid', auth.currentUser.uid);
        
        console.log('User IDs stored:', {
          mongoDbId: userData._id,
          firebaseUid: auth.currentUser.uid
        });
        
        return userData;
      } else {
        console.log('No user found with this email in the database');
        
        const newUserResponse = await createUserInMongoDB(userEmail, auth.currentUser.uid);
        if (newUserResponse && newUserResponse._id) {
          await AsyncStorage.setItem('firebaseUid', auth.currentUser.uid);
          return newUserResponse;
        }
        
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  
  const createUserInMongoDB = async (email, firebaseUid) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user`, {
        email,
        firebaseUid,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating user in MongoDB:', error);
      return null;
    }
  };

  const login = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter both email and password',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 60,
      });
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('firebaseUid');

      const authInstance = getAuth();
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);

      const userData = await fetchUserDataAndStoreUserId(email);

      if (!userData) {
        Toast.show({
          type: 'info',
          text1: 'Account Setup',
          text2: 'Setting up your account details...',
          visibilityTime: 3000,
          autoHide: true,
          topOffset: 60,
        });
      }

      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) throw new Error('Failed to retrieve or create MongoDB user ID');

      Toast.show({ 
        type: 'success', 
        text1: 'Success', 
        text2: 'Logged in!',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 50,
      });
      
      setTimeout(() => router.push('/home'), 1000);
    } catch (error) {
      console.log(error);

      let errorTitle = "Login Failed";
      let errorMessage = error.message;
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }

      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: errorMessage,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 60,
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (credential) => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('firebaseUid');

      const authInstance = getAuth();
      const userCredential = await signInWithCredential(authInstance, credential);

      const userData = await fetchUserDataAndStoreUserId(userCredential.user.email);

      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) throw new Error('Failed to retrieve or create MongoDB user ID');

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Successfully logged in with Google',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 60,
      });
      
      setTimeout(() => router.push('/home'), 1000);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Google Sign-In Failed',
        text2: 'An error occurred during Google sign-in. Please try again.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 60,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Sign in</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/sign-up')}
            activeOpacity={0.7}>
            <Text style={styles.newUserText}>
              New user? <Text style={styles.createAccountText}>Create an account</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              autoCapitalize="none"
              value={email}
              placeholder='Email'
              keyboardType="email-address"
              autoComplete="email"
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={password}
                placeholder='Password'
                autoComplete="password"
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setshowPassword(!showPassword)}>
                <Image
                  style={styles.eye}
                  source={!showPassword ? icons.eye : icons.eyeHide}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={login}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="black" size="small" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="black" size="small" />
            ) : (
              <>
                <Image
                  source={logo.GoogleIcon}
                  style={styles.googleIcon}
                  resizeMode="contain"
                />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={images.LoginPlayer}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
      
      <Toast />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    marginTop: 50
  },
  newUserText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  createAccountText: {
    color: '#3498db',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: 'white',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    color: 'white',
    fontSize: 16,
    padding: 8,
  },
  continueButton: {
    backgroundColor: 'white',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  continueButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: '#666',
    marginHorizontal: 8,
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  logo: {
    width: '100%',
    height: 200,
  },
  button: {
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  passwordInput: {
    flex: 1,
    height: 48,
    color: 'white',
    fontSize: 16,
    padding: 8,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 8,
    height: '100%',
    justifyContent: 'center',
  },
  eye: {
    height: 20,
    width: 20,
  },
});

export default SignIn;