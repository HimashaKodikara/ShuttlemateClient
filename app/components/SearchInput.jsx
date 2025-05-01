import { View, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../../constants/icons';
import { router, usePathname } from 'expo-router';
import Search from '../../assets/icons/search.png';

const SearchInput = () => {
  const pathname = usePathname();
  const [query, setQuery] = useState('');


  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="white"
        onChangeText={(e) => setQuery(e)}
      />
    <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
          
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
    height: 50,
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

export default SearchInput;