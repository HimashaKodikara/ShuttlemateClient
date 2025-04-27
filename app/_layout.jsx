import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';

const RootLayout = () => {
  return (
    <StripeProvider publishableKey="pk_test_51QJef7RwP0CS6vlpJKa4aIbmfRJdUMqt8K4Lm1dBEM63cbBBvBgHLbpblPVZND1G7iNtTVhNEqCqk1YcFVgWFlqL0084kYVZX8">
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name="(auth)" options={{headerShown:false}} />
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />
        <Stack.Screen name="(ItemPurchase)" options={{headerShown:false}} />
        <Stack.Screen name="(Payment)" options={{headerShown:false}} />
      </Stack>
    </StripeProvider>
  )
}

export default RootLayout