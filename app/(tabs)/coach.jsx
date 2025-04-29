import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
import CoachCard from '../components/CoachCard';
import Matches from '../components/Matches';
import { Feather, MaterialIcons,Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';


const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMatches, setShowMatches] = useState(false);
  const[refreshing, setRefreshing] = useState(false);
  
  

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data
    fetchCoaches();
    setRefreshing(false);
  }
  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/Coachers/`);
      if (response.data.success) {
        setCoaches(response.data.coachers);
      } else {
        setError('Failed to fetch coaches');
      }
    } catch (error) {
      console.error("Error fetching coaches:", error);
      setError('An error occurred while fetching coaches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const openModal = (coach) => {
    setSelectedCoach(coach);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCoach(null);
  };
  const toggleMatches = () => {
    setShowMatches(!showMatches);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCoaches}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Coaches</Text>

      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Select the coach requirement type</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.coachList}
       refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }>
        {coaches && coaches.length > 0 ? coaches.map((coach) => (
          <TouchableOpacity key={coach._id} onPress={() => openModal(coach)}>
            <View style={styles.coachCard}>
              <Image 
                source={{ uri: coach.CoachPhoto }}
                style={styles.coachImage}
              />
              <View style={styles.coachInfo}>
                <Text style={styles.coachName}>{coach.CoachName}</Text>
                <View style={styles.specialtiesContainer}>
                  {coach.TrainingType && coach.TrainingType.map((specialty, index) => (
                    <Text key={index} style={styles.specialty}>
                      {specialty}{index < coach.TrainingType.length - 1 ? ' | ' : ''}
                    </Text>
                  ))}
                </View>
                <Text style={styles.contactNumber}>{coach.Tel}</Text>
                <View style={styles.levelsContainer}>
                  {coach.Courts && coach.Courts.map((court, index) => (
                    <Text key={index} style={styles.level}>
                      {court.CourtName}{index < coach.Courts.length - 1 ? ' | ' : ''}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )) : (
          <Text style={styles.noCoaches}>No coaches available</Text>
        )}
         
      </ScrollView>

      {selectedCoach && (
        <CoachCard
          visible={modalVisible}
          coach={selectedCoach}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        />
      )}
     <TouchableOpacity
                  style={styles.matchesButton}
                  onPress={toggleMatches}
                  activeOpacity={0.7}
                >
                  <LottieView
                    source={require('../../assets/lottie/calendar.json')}
                    autoPlay
                    loop
                    style={{ width: 40, height: 40 }}
                    colorFilters={[
                      {
                        keypath: "**", // This targets all elements in the animation
                        color: "#FFFFFF" // White color
                      }
                    ]}
                  />
                </TouchableOpacity>
      
      {/* Matches component that shows when button is clicked */}
      {showMatches && <Matches visible={showMatches} onClose={toggleMatches} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141424',
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginTop: 30,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  dropdownText: {
    color: '#888',
    fontSize: 16,
  },
  dropdownIcon: {
    color: '#888',
    fontSize: 12,
  },
  coachList: {
    flex: 1,
  },
  coachCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  
    // Android shadow
    elevation: 5,
  
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  
  coachImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#333',
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  specialty: {
    color: '#bbb',
    fontSize: 12,
  },
  contactNumber: {
    color: '#bbb',
    fontSize: 12,
    marginBottom: 4,
  },
  levelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  level: {
    color: '#bbb',
    fontSize: 12,
  },
  noCoaches: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  matchesButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
});

export default Coaches;