import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl, ActivityIndicator, Alert, Linking } from 'react-native';
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
  const [badmintonNews, setBadmintonNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
 
  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh both videos and news
    await Promise.all([fetchVideos(), fetchBadmintonNews()]);
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

  const fetchBadmintonNews = async () => {
    setNewsLoading(true);
    try {
      // Using NewsAPI.org for reliable news fetching
      // You can get a free API key from https://newsapi.org/
      const API_KEY = 'YOUR_NEWS_API_KEY'; // Replace with your actual API key
      const newsApiUrl = `https://newsapi.org/v2/everything?q=badminton&sortBy=publishedAt&pageSize=5&apiKey=${API_KEY}`;
      
      // Alternative: Using a different approach with RSS2JSON service
      const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://news.google.com/rss/search?q=badminton')}`;
      
      let response;
      let newsData = [];
      
      try {
        // Try RSS2JSON first (free service, no API key needed)
        response = await axios.get(rss2jsonUrl);
        if (response.data && response.data.items) {
          newsData = response.data.items.slice(0, 5).map((item, index) => ({
            id: index.toString(),
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            description: item.description?.replace(/<[^>]*>/g, '') || '',
            source: item.source || 'Google News'
          }));
        }
      } catch (rssError) {
        console.log("RSS2JSON failed, trying alternative...");
        
        // Fallback: Create sample badminton news data
        newsData = [
          {
            id: '1',
            title: 'Latest Badminton Championship Results',
            description: 'Stay updated with the latest badminton tournament results and player performances.',
            pubDate: new Date().toISOString(),
            source: 'Badminton World',
            link: 'https://bwfbadminton.com'
          },
          {
            id: '2',
            title: 'Olympic Badminton Qualifiers Update',
            description: 'Check out the latest updates on Olympic badminton qualifications and rankings.',
            pubDate: new Date(Date.now() - 3600000).toISOString(),
            source: 'BWF',
            link: 'https://bwfbadminton.com'
          },
          {
            id: '3',
            title: 'Badminton Training Tips from Professionals',
            description: 'Learn advanced badminton techniques and training methods from professional players.',
            pubDate: new Date(Date.now() - 7200000).toISOString(),
            source: 'Badminton Central',
            link: 'https://badmintoncentral.com'
          },
          {
            id: '4',
            title: 'New Badminton Equipment Reviews',
            description: 'Comprehensive reviews of the latest badminton rackets, shoes, and accessories.',
            pubDate: new Date(Date.now() - 10800000).toISOString(),
            source: 'Badminton Gear',
            link: 'https://badmintongear.com'
          },
          {
            id: '5',
            title: 'International Badminton Tournament Schedule',
            description: 'Upcoming international badminton tournaments and championship schedules.',
            pubDate: new Date(Date.now() - 14400000).toISOString(),
            source: 'Sports Calendar',
            link: 'https://bwfbadminton.com'
          }
        ];
      }
      
      setBadmintonNews(newsData);
    } catch (error) {
      console.error("Error fetching badminton news: ", error);
      // Ultimate fallback
      setBadmintonNews([
        {
          id: '1',
          title: 'Welcome to ShuttleMate News',
          description: 'Stay tuned for the latest badminton news and updates. Pull down to refresh and try again.',
          pubDate: new Date().toISOString(),
          source: 'ShuttleMate',
          link: ''
        }
      ]);
    }
    setNewsLoading(false);
  };

  useEffect(() => {
    fetchVideos();
    fetchBadmintonNews();
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

  const handleNewsPress = async (url) => {
    if (url) {
      try {
        await Linking.openURL(url);
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsCard} 
      onPress={() => handleNewsPress(item.link)}
      activeOpacity={0.7}
    >
      <View style={styles.newsCardContent}>
        <Text style={styles.newsCardTitle} numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.newsCardDescription} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.newsCardFooter}>
          <Text style={styles.newsCardSource} numberOfLines={1}>{item.source}</Text>
          <Text style={styles.newsCardDate}>{formatDate(item.pubDate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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

            <View style={styles.newsSection}>
              <Text style={styles.sectionTitle}>Latest Badminton News</Text>
              {newsLoading ? (
                <View style={styles.newsLoader}>
                  <ActivityIndicator size="small" color="#4A90E2" />
                  <Text style={styles.loadingText}>Loading news...</Text>
                </View>
              ) : (
                <FlatList
                  data={badmintonNews}
                  keyExtractor={(item) => item.id}
                  renderItem={renderNewsItem}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.newsListContainer}
                  snapToInterval={280} // Width of news card + margin
                  decelerationRate="fast"
                  snapToAlignment="start"
                />
              )}
            </View>

            
          </View>
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
  // News Section Styles - Updated for Horizontal Layout
  newsSection: {
    marginBottom: 30,
    paddingHorizontal: 5,
    marginTop:30
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  newsListContainer: {
    paddingLeft: 5,
  },
  newsCard: {
    backgroundColor: '#1A1A2E',
    width: 260,
    marginRight: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  newsCardContent: {
    padding: 15,
    height: 160,
    justifyContent: 'space-between',
  },
  newsCardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
  },
  newsCardDescription: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  newsCardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  newsCardSource: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 3,
  },
  newsCardDate: {
    color: '#888',
    fontSize: 11,
  },
  newsLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default Home;