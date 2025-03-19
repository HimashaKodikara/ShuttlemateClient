import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {Link} from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.Header}>Shuttlemate</Text>
      <StatusBar style="auto" />
        <Link href="/home" style={{color:'blue'}}>Go to Home</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Header:{
    fontSize: 30,
    fontWeight: 'bold'
  }
});
