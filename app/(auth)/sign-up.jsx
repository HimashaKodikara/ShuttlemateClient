import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import images from '../../constants/images.js';
import logo from '../../constants/icons.js';
//import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const [request, response, promptAsync] = Google.useAuthRequest({
      expoClientId: 'YOUR_EXPO_CLIENT_ID',
      iosClientId: 'YOUR_IOS_CLIENT_ID',
      androidClientId: 'YOUR_ANDROID_CLIENT_ID',
      webClientId: '902062135902-u2gdc6rsgu4fkip7oljqttnam1fj9so0.apps.googleusercontent.com',
    });
  
  const sign = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    
    setLoading(true);
    try {
      const auth = getAuth(); // Initialize Firebase Authentication
      const response = await createUserWithEmailAndPassword(auth, email, password);
      
      console.log(response);
      
      // Show success message with React Native Alert
      Alert.alert(
        "Success!",
        "Sign Up Successful! Please log in.",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Navigate to sign-in page after the alert is closed
              setTimeout(() => {
                router.push('/sign-in');
              }, 500);
            }
          }
        ]
      );
    } catch (error) {
      console.log(error);
      
      // Handle specific Firebase auth errors with user-friendly messages
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Try signing in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      }
      
      Alert.alert(
        "Sign Up Failed",
        errorMessage,
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };
  

  const signInWithGoogle = async (credential) => {
      setLoading(true);
      try {
        // Sign-in with the credential
        const userCredential = await signInWithCredential(auth, credential);
        console.log('Google sign-in successful:', userCredential.user);
        
        Alert.alert(
          "Success!",
          "Successfully logged in with Google.",
          [
            { 
              text: "OK", 
              onPress: () => {
                // Navigate to home page after alert is closed
                setTimeout(() => {
                  router.push('/home');
                }, 500);
              }
            }
          ]
        );
      } catch (error) {
        console.log('Google Sign-In Error:', error);
        
        Alert.alert(
          "Google Sign-In Failed",
          "An error occurred during Google sign-in. Please try again.",
          [{ text: "OK" }]
        );
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Explore now</Text>
        <Text style={styles.subHeaderText}>Join with us today.</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#666"
            autoCapitalize="none"
            value={email}
            placeholder='Enter your Email'
            keyboardType="email-address"
            autoComplete="email"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#666"
            secureTextEntry={true}
            value={password}
            placeholder='Enter your Password'
            autoComplete="password-new"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={sign}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="black" size="small" />
          ) : (
            <Text style={styles.createButtonText}>Create account</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
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
        
        {/* Sign-in section with background image */}
        <View style={styles.signinContainerWrapper}>
          <Image
            source={images.LoginPlayer}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account?</Text>
            <TouchableOpacity 
              onPress={() => router.push('/sign-in')}
              activeOpacity={0.7}>
              <Text style={styles.signinLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  formContainer: {
    padding: 20,
    paddingTop: 40,
    flex: 1,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#CC9900',
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#CC9900',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingVertical: 8,
    color: 'white',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  createButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: 'white',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  signinContainerWrapper: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 10,
    height: 200, // Adjust height as needed for your image
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 2,
    paddingTop: 20, // Adjust as needed to position the text over the image
  },
  signinText: {
    color: '#aaa',
    marginRight: 5,
  },
  signinLink: {
    color: '#0095ff',
  },
});

export default Signup;