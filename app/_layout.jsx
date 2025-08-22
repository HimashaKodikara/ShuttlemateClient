import React, { useEffect } from 'react';
import { Alert, View, Text } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack, Slot } from 'expo-router';
import { router } from 'expo-router';
import API_BASE_URL from '../server/api.config';
import Toast from 'react-native-toast-message';

// Toast configuration - MOVED TO TOP
const toastConfig = {
  success: (props) => (
    <View style={{ 
      height: 60, 
      width: '90%', 
      backgroundColor: '#4CAF50',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginHorizontal: 20,
      paddingHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
        {props.text1}
      </Text>
      {props.text2 && (
        <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>
          {props.text2}
        </Text>
      )}
    </View>
  ),
  error: (props) => (
    <View style={{ 
      height: 60, 
      width: '90%', 
      backgroundColor: '#F44336',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginHorizontal: 20,
      paddingHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
        {props.text1}
      </Text>
      {props.text2 && (
        <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>
          {props.text2}
        </Text>
      )}
    </View>
  ),
  info: (props) => (
    <View style={{ 
      height: 60, 
      width: '90%', 
      backgroundColor: '#2196F3',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginHorizontal: 20,
      paddingHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
        {props.text1}
      </Text>
      {props.text2 && (
        <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>
          {props.text2}
        </Text>
      )}
    </View>
  ),
  warning: (props) => (
    <View style={{ 
      height: 60, 
      width: '90%', 
      backgroundColor: '#FF9800',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginHorizontal: 20,
      paddingHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
        {props.text1}
      </Text>
      {props.text2 && (
        <Text style={{ color: 'white', fontSize: 14, marginTop: 4 }}>
          {props.text2}
        </Text>
      )}
    </View>
  ),
};

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
                // Token registered successfully
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

        // Handle notification when app is opened from quit state
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

        // Handle notification when app is opened from background
        messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('Opened from background state:', remoteMessage.notification);
          handleNotificationNavigation(remoteMessage.data);
        });

        // Handle notification when app is in background and killed
        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.log('Handled in background:', remoteMessage);
        });

        // Handle foreground notifications
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
    <StripeProvider
      publishableKey="pk_test_51QJef7RwP0CS6vlpJKa4aIbmfRJdUMqt8K4Lm1dBEM63cbBBvBgHLbpblPVZND1G7iNtTVhNEqCqk1YcFVgWFlqL0084kYVZX8"
      merchantIdentifier="merchant.com.shuttlemate"
    >
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(ItemPurchase)" options={{ headerShown: false }} />
        <Stack.Screen name="(Payment)" options={{ headerShown: false }} />
        <Stack.Screen name="searchcoach/[query1]" options={{ headerShown: false }} />

      </Stack>
      <Toast config={toastConfig} />
    </StripeProvider>
  );
};

export default RootLayout;