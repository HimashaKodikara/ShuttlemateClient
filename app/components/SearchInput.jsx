import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import image from '../../constants/icons.js'

const SearchInput = () => {
  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#CDCDE0"
          autoCapitalize="none"
          placeholder='Search for a video topic'
          selectionColor="#fff"
        />
        <TouchableOpacity style={styles.searchIcon}>
        <Image source={image.search} style={styles.searchIcon} />
        </TouchableOpacity>
       
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginTop: 10,
    position: 'relative',
    flex: 1,
  },
  input: {
    height: 48,
    color: 'white',
    fontSize: 16,
    padding: 8,
    marginTop: 2, // equivalent to mt-0.5
    flex: 1,
    paddingRight: 40, // make room for the icon
  },
  searchIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 8,
    
  }
})

export default SearchInput