import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../constants/images.js'
import logo from '../../constants/icons.js';
import { Redirect, router } from 'expo-router';
import { FIREBASE_AUTH } from '../../firebaseconfig.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import firebase from "firebase/app";


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const login = async () =>{
    setLoading(true);
    try{
      const response = await signInWithEmailAndPassword(auth,email,password);
      console.log(response);
      alert('Check your emails');
    }catch(error){
   console.log(error);
   alert('Registration Failed' + error.message);
    }finally{
      setLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Sign in</Text>

          <TouchableOpacity style={styles.button}
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
              autoComplete='none'
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#666"
              secureTextEntry={true}
              value={password}
              placeholder='Password'
              autoComplete='none'
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <TouchableOpacity style={styles.continueButton}  onPress={login}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={logo.GoogleIcon}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A', // Dark blue/black background as shown in image
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
  bottomImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
});

export default SignIn;