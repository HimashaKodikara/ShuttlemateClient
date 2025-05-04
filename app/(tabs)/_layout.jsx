import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import icons from '../../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={styles.iconContainer}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[styles.icon, { tintColor: color }]}
      />
      <Text style={[styles.text, { color }]}>{name}</Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor:'#CDCDE0',
          tabBarStyle:{
            backgroundColor: "black",
            borderTopWidth: 0,
            borderTopColor: "#232533",
            height: 55,
            marginHorizontal: 16, 
            borderRadius: 25,   
            position: 'absolute',
            bottom: 10,
            paddingTop: 10,         
            paddingHorizontal: 10, 
            // Shadow for iOS
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            // Shadow for Android
            elevation: 5,
          },
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          ),
          // Make content fill the screen beneath the tab bar
          contentStyle: { 
            backgroundColor: '#161622' 
          }
        }}
        safeAreaInsets={{ bottom: 0 }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="court"
          options={{
            title: 'Court',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Court"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="coach"
          options={{
            title: 'Coach',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Coach"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Shop',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.shop}
                color={color}
                name="Shop"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622', // Match your app's background color
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  icon: {
    width: 22,
    height: 22,
    marginTop: 6
  },
  text: {
    fontSize: 10,
    marginTop: 2,
  },
});