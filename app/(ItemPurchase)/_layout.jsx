import { StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import icons from '../../constants/icons';

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
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        marginTop: 10,
        tabBarStyle: {

          backgroundColor: "#161622",
          borderTopWidth: 0,
          borderTopColor: "#232533",

          height: 55,

        }
      }}
    >

      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
          headerShown: false,

          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.shop}
              color={color}
              name="Items"
              focused={focused}
            />
          ),
        }}
      />





    </Tabs>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,

  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 20
  },
  text: {
    fontSize: 10,
    marginTop: 2,
  },
});
