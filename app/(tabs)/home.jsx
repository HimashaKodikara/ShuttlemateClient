import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native';
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
import API_BASE_URL from '../../server/api.config';

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data
    fetchVideos();
    setRefreshing(false);
  }

  const fetchVideos = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/videos/`)
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
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setLoading(false);
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

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('loginTimestamp');
              await signOut(FIREBASE_AUTH);
              router.replace('/sign-in');
            } catch (error) {
              console.error("Error signing out: ", error);
            }
          }
        }
      ]
    );
  };

  // Display loader if loading is true
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoTitleContainer}>
            <Image
              source={images.Logo}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.titleText}>ShuttleMate</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      </SafeAreaView>
    );
  }

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
              <View style={styles.logoTitleContainer}>
                <Image
                  source={images.Logo}
                  resizeMode="contain"
                  style={styles.logo}
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.welcomeText}>Welcome Back</Text>
                  <Text style={styles.titleText}>ShuttleMate</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <MaterialIcons name="logout" size={24} color="white" />
              </TouchableOpacity>
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
    fontSize: 20,
  },
  titleText: {
    color: '#fff',
    fontSize: 18,
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
  logoTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  latestVideosText: {
    fontSize: 15,
    marginTop: 12,
    color: 'grey',
    marginBottom: 12,
    marginLeft: 5
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  logoutButton: {
    padding: 8,
  },
});

export default Home;