import { View, Text, FlatList ,StyleSheet} from 'react-native'
import React from 'react'

const Trending = ({posts}) => {
  return (
   <FlatList
   data={posts}
   keyExtractor={(item) => item.id}
   renderItem={({item}) => (
    <Text style={styles.text}>{item.id}</Text>
   )}
   horizontal
   />
  )
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: 22,
      
        marginTop: 2, // equivalent to mt-0.5
        flex: 1,
        // make room for the icon
    },
})
export default Trending