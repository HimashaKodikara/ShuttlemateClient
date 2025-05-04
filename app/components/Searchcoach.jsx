import { View, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../../constants/icons';
import { router, usePathname } from 'expo-router';
import Search from '../../assets/icons/search.png';

const Searchcoach = () => {
  const pathname = usePathname();
  const [query1, setQuery1] = useState('');


  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={query1}
        placeholder="Search coach by name"
        placeholderTextColor="white"
        onChangeText={(e) => setQuery1(e)}
      />
    <TouchableOpacity
        onPress={() => {
          if (query1 === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );

          if (pathname.startsWith("/search")) router.setParams({ query1 });
          else router.push(`/searchcoach/${query1}`);
          
        }}
      >
        <Image source={Search} style={{ width: 25, height: 25, marginTop: 7 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 2,
    width: '100%',
    height: 45,
    paddingHorizontal: 16,
    backgroundColor: 'gray',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 2,
  },
  input: {
    flex: 1,
    color: 'white',
  },
});

export default Searchcoach;