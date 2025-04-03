import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import images from '../../constants/images.js'
import logo from '../../constants/icons.js'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import firebase from "firebase/app";
import Swal from 'sweetalert2';



const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const sign = async () => {
    setLoading(true);
    try {
      const auth = getAuth(); // Initialize Firebase Authentication
      const response = await createUserWithEmailAndPassword(auth, email, password);

     

      // Show success message with SweetAlert2
      Swal.fire({
        title: 'Success!',
        text: 'Sign Up Successful! Please log in.',
        icon: 'success',
        confirmButtonText: 'OK'
      })
        .then(() => {
        router.push('/sign-in');
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Error!',
        text: 'Sign Up failed: ' + error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
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
            placeholder='Ente your Email'
            autoComplete='none'
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
            autoComplete='none'
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <TouchableOpacity style={styles.createButton} onPress={sign}>
          <Text style={styles.createButtonText}>Create account</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={logo.GoogleIcon}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
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