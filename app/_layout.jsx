import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack } from 'expo-router';
import API_BASE_URL from '../server/api.config';

const RootLayout = () => {
  useEffect(() => {
    let unsubscribeOnMessage;

    const setupNotifications = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          console.log("FCM Token:", fcmToken);
          await fetch(`${API_BASE_URL}/notifications/register-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: fcmToken }),
          });
        }
      } else {
        console.log("FCM permission denied");
      }

      // Handle notification opened when app was closed
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log('Opened from quit state:', remoteMessage.notification);
          }
        });

      // Handle notification when app is in background
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Opened from background state:', remoteMessage.notification);
      });

      // Handle notification when app is in background and killed
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Handled in background:', remoteMessage);
      });

      // Handle notification when app is in foreground
      unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
        Alert.alert('New Message', JSON.stringify(remoteMessage.notification));
      });
    };

    setupNotifications();

    // Cleanup on unmount
    return () => {
      if (unsubscribeOnMessage) {
        unsubscribeOnMessage();
      }
    };
  }, []);

  return (
    <StripeProvider publishableKey="pk_test_51QJef7RwP0CS6vlpJKa4aIbmfRJdUMqt8K4Lm1dBEM63cbBBvBgHLbpblPVZND1G7iNtTVhNEqCqk1YcFVgWFlqL0084kYVZX8">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(ItemPurchase)" options={{ headerShown: false }} />
        <Stack.Screen name="(Payment)" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
        <Stack.Screen name="searchcoach/[query1]" options={{ headerShown: false }} />
      </Stack>
    </StripeProvider>
  );
};

export default RootLayout;
