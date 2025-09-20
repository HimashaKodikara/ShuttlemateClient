import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl, ActivityIndicator, Alert, Linking, ImageBackground } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import images from '../../constants/images';
import SearchInput from '../components/SearchInput';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import VideoCard from '../components/VideoCard';
import API_BASE_URL from '../../server/api.config';

import bg from '../../assets/backgorundimg.jpg'

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;



const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [badmintonNews, setBadmintonNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const[newsLoding, setNewsLoading] = useState(true);
  const auth = getAuth();


    const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchVideos(), fetchNews()]);
    setRefreshing(false);
  }
  // Fetch videos from the API, update items and trending videos state
  const fetchVideos = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/videos/`)
      .then(response => {
        setItems(response.data.videos);

        if (response.data.videos && response.data.videos.length > 0) {
          // Sort videos by creation date (newest first)
          const sortedVideos = [...response.data.videos].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          // Take the 3 most recent videos as trending
          const recentVideos = sortedVideos.slice(0, 3);

          // Format trending videos for display
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

  // Fetch latest badminton news from the API and update state
  const fetchNews = () => {
    setNewsLoading(true);
    return axios.get(`${API_BASE_URL}/news`)
      .then(response => {
        const formattedNews = response.data.map((newsItem) => ({
          id: newsItem._id,
          title: newsItem.title,
          description: newsItem.body,
          source: newsItem.source,
          time: formatTimeAgo(newsItem.time || newsItem.createdAt),
          createdAt: newsItem.createdAt
        }));
        setBadmintonNews(formattedNews);
        setNewsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching news:", error);
        setNewsLoading(false);
      })
  }

// Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now - time;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

 useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchVideos(), fetchNews()]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
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

  
// Handles user logout with confirmation dialog
const handleLogout = async () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('loginTimestamp');
            const auth = getAuth(); // modular
            await signOut(auth);
            router.replace('/sign-in');
          } catch (error) {
            console.error("Logout error: ", error);
            Alert.alert("Error", "Failed to log out. Try again.");
          }
        }
      }
    ]
  );
};


  const getCategoryColor = (category) => {
    const colors = {
      'Tournament': '#FF6B6B',
      'Olympics': '#4ECDC4',
      'Training': '#45B7D1',
      'Equipment': '#96CEB4',
      'Youth': '#FFEAA7'
    };
    return colors[category] || '#4A90E2';
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsCard}
      activeOpacity={0.8}
    >
      <View style={styles.newsCardContent}>
        <View style={styles.newsHeader}>
           <Text style={styles.categoryText}>News</Text>
          <Text style={styles.newsTime}>{item.time}</Text>
        </View>
        
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.newsDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.newsFooter}>
          <View style={styles.sourceContainer}>
            <MaterialIcons name="article" size={14} color="#4A90E2" />
            <Text style={styles.newsSource}>{item.source}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Display loader if loading is true
  if (loading) {
    return (
      <ImageBackground
        source={bg}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
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
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={bg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
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

                <View style={styles.newsSection}>
                  <View style={styles.sectionHeader}>
                    <MaterialIcons name="newspaper" size={20} color="#4A90E2" />
                    <Text style={styles.sectionTitle}>Latest Badminton News</Text>
                  </View>
                  
                  <FlatList
                    data={badmintonNews}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNewsItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.newsListContainer}
                    snapToInterval={290}
                    decelerationRate="fast"
                    snapToAlignment="start"
                  />
                </View>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4A90E2']}
                tintColor="#4A90E2"
              />
            }
          />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 26, 0.98)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
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
    marginLeft: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
  },
  
  // Enhanced News Section Styles
  newsSection: {
    marginBottom: 30,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  newsListContainer: {
    paddingLeft: 5,
    paddingRight: 10,
  },
  newsCard: {
    backgroundColor: '#1A1A2E',
    width: 280,
    marginRight: 15,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  newsCardContent: {
    padding: 16,
    height: 180,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fbf8f8ff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  newsTime: {
    color: '#888',
    fontSize: 11,
  },
  newsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
  },
  newsDescription: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
    marginBottom: 12,
  },
  newsFooter: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsSource: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default Home;