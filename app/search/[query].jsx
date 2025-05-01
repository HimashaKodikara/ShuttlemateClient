import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import EmptyState from '../components/EmptyState';
import API_BASE_URL from '../../server/api.config';
import { Feather } from '@expo/vector-icons';

const Search = () => {
  const { query } = useLocalSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      setLoading(false);
      setSearchResults([]);
    }
  }, [query]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/videos/search?search=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Failed to fetch search results. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{query}</Text>
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Searching for "{query}"...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{query}</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={50} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSearchResults}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={({ item }) => (
            <VideoCard
              videoName={item.videoName}
              videoCreator={item.videoCreator}
              imgUrl={item.imgUrl}
              videoUrl={item.videoUrl}
              videoCreatorPhoto={item.videoCreatorPhoto}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Results Found"
              subtitle={`We couldn't find any videos matching "${query}"`}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default Search;