import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';


export default function PaymentLayout() {
  return (
    <>
    
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
