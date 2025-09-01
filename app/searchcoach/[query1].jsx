import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import EmptyState from '../components/EmptyState';
import API_BASE_URL from '../../server/api.config';
import { Feather } from '@expo/vector-icons';

const CoachListItem = ({ coach }) => {
  // Function to handle phone number click
  const handlePhoneCall = () => {
    if (coach.Tel) {
      const phoneNumber = `tel:${coach.Tel}`;
      Linking.openURL(phoneNumber).catch((err) =>
        console.error('Error making the call:', err)
      );
    }
  };

  // Function to navigate to Courts screen with the selected court
  const navigateToCourt = (court) => {

    onRequestClose();


    navigation.navigate('court', {
      selectedCourtId: court._id,
      courtName: court.CourtName
    });
  };

  // Check if Courts are properly populated objects or just IDs
  const hasPopulatedCourts = coach.Courts?.length > 0 &&
    typeof coach.Courts[0] === 'object' &&
    coach.Courts[0] !== null &&
    coach.Courts[0].CourtName !== undefined;

  return (
    <View style={styles.coachListItem}>
      <View style={styles.coachHeader}>
        <Image
          source={{ uri: coach.CoachPhoto }}
          style={styles.coachThumbnail}
        />
        <View style={styles.coachMainInfo}>
          <Text style={styles.coachName}>{coach.CoachName}</Text>
          <Text style={styles.coachSpecialty}>
            {coach.TrainingType?.slice(0, 2).join(' | ') || 'Coach'}
            {coach.TrainingType?.length > 2 ? ' • ...' : ''}
          </Text>
          <TouchableOpacity onPress={handlePhoneCall} style={styles.phoneContainer}>
            <Feather name="phone" size={14} color="white" />
            <Text style={styles.phoneText}>{coach.Tel || 'No phone number'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Coaching Experience</Text>
          <Text style={styles.infoText}>{coach.Experiance || '1'} Years</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoLabel}>Training For</Text>
        <View style={styles.specialtiesContainer}>
          {coach.TrainingType?.map((specialty, index) => (
            <Text key={index} style={styles.specialty}>
              {specialty}
              {index < coach.TrainingType.length - 1 ? ' | ' : ''}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoLabel}>Certificates</Text>
        {(coach.Certificates?.length ? coach.Certificates :
          coach.Certifications ? [coach.Certifications] : []
        ).map((cert, idx) => (
          <Text key={idx} style={styles.certificate}>{cert}</Text>
        ))}

      </View>
      
    </View>
  );
};

const Search = () => {
  // Get the query parameter from URL
  const params = useLocalSearchParams();
  const query1 = params.query1;

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query1) {
      fetchSearchResults();
    } else {
      setLoading(false);
      setSearchResults([]);
    }
  }, [query1]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/Coachers/search?search=${encodeURIComponent(query1)}`;
      const response = await axios.get(url);
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
          <Text style={styles.headerTitle}>{query1 || "Search"}</Text>
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Searching for "{query1}"...</Text>
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
        <Text style={styles.headerTitle}>{query1 || "Search Results"}</Text>
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
          keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
          renderItem={({ item }) => (
            <CoachListItem coach={item} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Results Found"
              subtitle={`We couldn't find any coaches matching "${query1}"`}
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
    paddingHorizontal: 16,
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
  },
  // Coach list item styles
  coachListItem: {
    backgroundColor: '#1A1A2A',
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coachHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  coachThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2A3A',
  },
  coachMainInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  coachName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  coachSpecialty: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 6,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: 'white',
  },
  section: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  specialty: {
    fontSize: 14,
    color: 'white',
  },
  certificate: {
    fontSize: 14,
    color: 'white',
    marginTop: 2,
  },
  placesContainer: {
    marginTop: 4,
  },
  placeItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#2A2A3A',
    borderRadius: 6,
  },
  placeLocation: {
    fontSize: 12,
    color: '#BBBBBB',
  },
  placeCourtClickable: {
    fontSize: 14,
    color: '#4A90E2',
    marginTop: 2,
  }
});

export default Search;