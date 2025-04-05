import React, { useState,useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native'; // Changed from react-native-web to react-native
import images from '../../constants/images';
import SearchInput from '../components/SearchInput';
import Trending from '../components/Trending';
import EmptyState from '../components/EmptyState';
import axios from 'axios';

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
        console.log("Data fetched:", response.data.videos);
      setItems(response.data.videos);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, []);
  // Sample data with proper key identifiers
  const sampleData = [
    { id: '1', title: 'Item 1' }, 
    { id: '2', title: 'Item 2' }, 
    { id: '3', title: 'Item 3' }, 
    { id: '4', title: 'Item 4' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id} // Use id as key instead of $id
        renderItem={({ item }) => (
          <Text style={styles.list}>{item.videoName}</Text>
          
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