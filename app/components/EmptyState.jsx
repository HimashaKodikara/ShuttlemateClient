import { View, Text ,StyleSheet,Image} from 'react-native'
import React from 'react'
import images from '../../constants/images.js'
const EmptyState = ({title,subtitle}) => {
  return (
    <View style={styles.container}>
      <Image source={images.Empty} resizeMode='contain' style={styles.image}/>
      <Text style={{color:'white'}}>{title}</Text>
      <Text style={{color:'white',marginTop:5}}>{subtitle}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:4
},
image:{
    width: 200,
    height: 200,
    marginBottom: 10
}
})


export default EmptyState