import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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
