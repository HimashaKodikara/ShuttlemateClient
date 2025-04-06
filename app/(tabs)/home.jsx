import React, { useState, useEffect } from 'react';
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
  const [items, setItems] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState([]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data
    fetchVideos();
    setRefreshing(false);
  }

  const fetchVideos = () => {
    axios.get('http://192.168.1.10:5000/api/videos/')
      .then(response => {
      
        setItems(response.data.videos);
        
        if (response.data.videos && response.data.videos.length > 0) {
          // Sort by most recent (assuming there's a timestamp or id that indicates recency)
          const sortedVideos = [...response.data.videos].sort((a, b) => {
            // If you have a timestamp field, use that for sorting
             return new Date(b.createdAt) - new Date(a.createdAt);
          
          });
          
        
          const recentVideos = sortedVideos.slice(0, 3);
          
        
          const formattedTrending = recentVideos.map((video, index) => ({
            $id: video.id ? video.id.toString() : index.toString(),
            imgUrl: video.imgUrl,
            videoUrl: video.videoUrl
          }));
          
          setTrendingVideos(formattedTrending);
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    fetchVideos();
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
          router.replace('/sign-in');
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
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <VideoCard
            videoName={item.videoName}
            videoCreator={item.videoCreator}
            imgUrl={item.imgUrl}
            videoUrl={item.videoUrl}
            videoCreatorPhoto={item.videoCreatorPhoto}
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

              {trendingVideos.length > 0 && (
                <Trending posts={trendingVideos} />
              )}
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
    padding: 7,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,

  },
  titleText: {
    color: '#fff',
    fontSize: 30,
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
    marginTop: 40,
    padding: 10,
  },
  latestVideosText: {
    fontSize: 15,
    marginTop: 12,
    color: 'grey',
    marginBottom: 12,
    marginLeft:5
  },
});

export default Home;