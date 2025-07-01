import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import API_BASE_URL from '../server/api.config';

const RootLayout = () => {
  // Navigation handler for notifications
  const handleNotificationNavigation = (data) => {
    try {
      if (data?.screen) {
        
        switch (data.screen) {
          case 'profile':
            router.push('/(tabs)/profile');
            break;
          case 'messages':
            router.push('/(tabs)/messages');
            break;
          case 'item':
            if (data.itemId) {
              router.push(`/(ItemPurchase)/${data.itemId}`);
            }
            break;
          case 'match':
            
            if (data.matchId) {
              router.push('/(tabs)/matches'); 
            }
            break;
          case 'court':
          
            if (data.courtId) {
            
              router.push('/(tabs)/court'); 
            }
            break;
          case 'coach':
            if (data.coachId) {
              router.push('/(tabs)/coach');
            }
            break;
          
          case 'shop':
            router.push('/(tabs)/shop');
            break;
          default:
         
            router.push('/(tabs)');
        }
      } else if (data?.url) {
     
        router.push(data.url);
      } else {
    
        router.push('/(tabs)');
      }
    } catch (error) {
      console.error('Navigation error:', error);
     
      router.push('/(tabs)');
    }
  };

  useEffect(() => {
    let unsubscribeOnMessage;

    const setupNotifications = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const fcmToken = await messaging().getToken();
          if (fcmToken) {
            console.log("FCM Token:", fcmToken);
            
            try {
              const response = await fetch(`${API_BASE_URL}/notifications/register-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: fcmToken }),
              });
              
              if (response.ok) {
              } else {
                console.error("Failed to register token:", response.status);
              }
            } catch (error) {
              console.error("Error registering token:", error);
            }
          }
        } else {
          console.log("FCM permission denied");
        }

        
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
              console.log('Opened from quit state:', remoteMessage.notification);
            
              setTimeout(() => {
                handleNotificationNavigation(remoteMessage.data);
              }, 1000); 
            }
          });

        
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('Opened from background state:', remoteMessage.notification);
          // Navigate when app is opened from background
          handleNotificationNavigation(remoteMessage.data);
        });

        // Handle notification when app is in background and killed
        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.log('Handled in background:', remoteMessage);
        });

  
        unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
          const notification = remoteMessage.notification;
          const data = remoteMessage.data;
          const title = notification?.title || 'Notification';
          const body = notification?.body || 'You have received a new notification.';
          
          Alert.alert(
            title,
            body,
            [
              {
                text: 'Dismiss',
                style: 'cancel',
              },
              {
                text: 'View',
                style: 'default',
                onPress: () => {
                  handleNotificationNavigation(data);
                },
              },
            ],
            { cancelable: true }
          );
        });
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
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
        <Stack.Screen name="match" options={{ headerShown: false }} />
        <Stack.Screen name="court/[id]" options={{ headerShown: false }} />
      </Stack>
    </StripeProvider>
  );
};

export default RootLayout;