import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../constants/images';
import { Redirect,router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Angled split image component
const AngledSplitImageContainer = ({ leftImage, rightImage, style }) => {
  return (
    <View style={[styles.splitImageContainer, style]}>
      {/* Left image with rounded corners */}
      <View style={styles.leftImageWrapper}>
        <Image 
          source={leftImage} 
          style={styles.splitImage} 
          resizeMode="cover" 
        />
      </View>
      
      {/* Right image with rounded corners */}
      <View style={styles.rightImageWrapper}>
        <Image 
          source={rightImage} 
          style={styles.splitImage} 
          resizeMode="cover" 
        />
      </View>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      
        <View style={styles.logoTextContainer}>
          <Image 
            source={images.Logo} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <Text style={styles.heading}>ShuttleMate</Text>
        </View>
        
      
        <AngledSplitImageContainer 
          leftImage={images.SCImage1}
          rightImage={images.SCImage2}
          style={styles.splitImageContainerStyle}
        />
        
        {/* Tagline and Description */}
        <View style={styles.textSection}>
          <Text style={styles.tagline}>Master the Court  Dominate the Game.</Text>
          <Text style={styles.description}>
            Continually practice and update{'\n'}your skills.
          </Text>
        </View>
        
        {/* CTA Button */}
        <TouchableOpacity style={styles.button}
        onPress={() => router.push('/sign-in')}
        activeOpacity={0.7}>
          <Text style={styles.buttonText}>Start Practicing</Text>
        </TouchableOpacity>

        <StatusBar backgroundColor='#161622'
        style='light'/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A', // Dark blue/black background as shown in image
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.9,
    marginTop: 50,
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
    textAlign:'center'
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  splitImageContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    height: width * 0.6,
    alignSelf: 'center',
    marginTop:50
  },
  splitImageContainerStyle: {
    marginVertical: 10,
  },
 
  leftImageWrapper: {
    flex: 1,
    marginRight: 5,
    borderRadius: 20,
    overflow: 'hidden',
    transform: [{ rotate: '-5deg' }],
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,  // Add this line
    borderColor: 'white',  // Add this line - using your orange button color
  },
  rightImageWrapper: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 20,
    overflow: 'hidden',
    transform: [{ rotate: '5deg' }],
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,  // Add this line
    borderColor: 'white',  // Add this line - using your orange button color
  },
  splitImage: {
    width: '100%',
    height: '100%',
  },
  textSection: {
    alignItems: 'center',
    width: width * 0.9,
    marginTop: 60,
    marginBottom: 30,
  },
  tagline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0', // Light gray for secondary text
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FF8A00', // Orange button color
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: width * 0.9,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});