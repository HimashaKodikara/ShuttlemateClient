import React, { useState,useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native'; // Changed from react-native-web to react-native
import images from '../../constants/images';
import SearchInput from '../components/SearchInput';
import Trending from '../components/Trending';
import EmptyState from '../components/EmptyState';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseconfig';
import { router } from 'expo-router';
import VideoCard from '../components/VideoCard';

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  }

  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.1.10:5000/api/videos/')
      .then(response => {
       // console.log("Data fetched:", response.data.videos);
      setItems(response.data.videos);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, []);
 

  // Session Timeout Logic
  useEffect(() => {
    const checkSessionTimeout = async () => {
      try {
        const timestamp = await AsyncStorage.getItem('loginTimestamp');
        const now = Date.now();

        if (timestamp && now - parseInt(timestamp, 10) > SESSION_TIMEOUT) {
          // Session expired
          await AsyncStorage.removeItem('loginTimestamp');
          await signOut(FIREBASE_AUTH);
          router.replace('/sign-in'); // Redirect to sign-in screen
        }
      } catch (error) {
        console.error('Session timeout check failed:', error);
      }
    };

    
    
    const interval = setInterval(() => {
      checkSessionTimeout();
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id} // Use id as key instead of $id
        renderItem={({ item }) => (
          <VideoCard 
          videoName={item.videoName}
          videoCreator={item.videoCreator}
          imgUrl={item.imgUrl}

          />
        )}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.header}>
              <View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.titleText}>ShuttleMate</Text>
                
              </View>
              <View>
                <Image
                  source={images.Logo}
                  resizeMode="contain" // Changed from resizeMethod to resizeMode
                  style={{ width: 50, height: 50 }}
                />
              </View>
            </View>
            <SearchInput />

            <View>
              <Text style={styles.latestVideosText}>
                Latest Videos
              </Text>
              <Trending posts={[
                {id: '1'}, 
                {id: '2'}, 
                {id: '3'}
              ]} /> 
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Please upload video" 
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    padding: 16,
  },
  welcomeText: {
    color: '#888',
    fontSize: 14,
  },
  titleText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
    padding: 10,
  },
  latestVideosText: {
    fontSize: 18,
    marginTop: 12,
    color: '#f5f5f5',
    marginBottom: 12,
  },
});

export default Home;