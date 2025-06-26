import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  FlatList,
  ImageBackground
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
import CoachCard from '../components/CoachCard';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import Searchcoach from '../components/Searchcoach';
import bg from '../../assets/backgorundimg.jpg'

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [selectedTrainingType, setSelectedTrainingType] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCoaches();
    setRefreshing(false);
  };

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      
      const response = await axios.get(`${API_BASE_URL}/Coachers/`);
      
  
      
      if (response.data && response.data.success) {
       
        
        setCoaches(response.data.coachers || []);
        setFilteredCoaches(response.data.coachers || []);

        // Extract all unique training types
        const allTrainingTypes = new Set();
        if (response.data.coachers && Array.isArray(response.data.coachers)) {
          response.data.coachers.forEach(coach => {
            if (coach.TrainingType && Array.isArray(coach.TrainingType)) {
              coach.TrainingType.forEach(type => {
                allTrainingTypes.add(type);
              });
            }
          });
        }
        setTrainingTypes(Array.from(allTrainingTypes));
      } else {
        console.error('API response indicates failure:', response.data);
        setError('Failed to fetch coaches - API returned unsuccessful response');
      }
    } catch (error) {
      console.error("Error fetching coaches:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.response) {
        // Server responded with error status
        setError(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // Network error
        setError('Network error - please check your connection');
      } else {
        // Other error
        setError(`Error: ${error.message}`);
      }
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectTrainingType = (type) => {
    setSelectedTrainingType(type);
    setDropdownVisible(false);

    if (type === null) {
      setFilteredCoaches(coaches);
    } else {
      const filtered = coaches.filter(coach =>
        coach.TrainingType && coach.TrainingType.includes(type)
      );
      setFilteredCoaches(filtered);
    }
  };

  // Debug: Add console logs to track state changes
  useEffect(() => {
  }, [coaches]);

  useEffect(() => {
  }, [filteredCoaches]);

  if (loading) {
    return (
        <ImageBackground
      source={bg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading coaches...</Text>
      </View>
      </ImageBackground>
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
    <ImageBackground
      source={bg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Coaches</Text>
          
        

          <View style={styles.dropdownContainer}>
            <View style={styles.searchFilterRow}>
              <View style={styles.searchContainer}>
                <Searchcoach />
              </View>
              <TouchableOpacity style={styles.filterButton} onPress={toggleDropdown}>
                <Feather name="filter" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Training Type Dropdown Modal */}
            <Modal
              visible={dropdownVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setDropdownVisible(false)}
            >
              <TouchableOpacity
                style={styles.dropdownOverlay}
                activeOpacity={1}
                onPress={() => setDropdownVisible(false)}
              >
                <View style={styles.dropdownMenu}>
                  <Text style={styles.modalTitle}>Select Your Requirement</Text>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => selectTrainingType(null)}
                  >
                    <Text style={styles.dropdownItemText}>All</Text>
                  </TouchableOpacity>

                  {trainingTypes.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => selectTrainingType(type)}
                    >
                      <Text style={styles.dropdownItemText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          <ScrollView
            style={styles.coachList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            {filteredCoaches && filteredCoaches.length > 0 ? (
              filteredCoaches.map((coach) => (
                <TouchableOpacity key={coach._id} onPress={() => openModal(coach)}>
                  <View style={styles.coachCard}>
                    <Image
                      source={{ uri: coach.CoachPhoto }}
                      style={styles.coachImage}
                      onError={(error) => console.log('Image load error:', error)}
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
              ))
            ) : (
              <View style={styles.noCoachesContainer}>
                <Text style={styles.noCoaches}>
                  {selectedTrainingType
                    ? `No coaches found for ${selectedTrainingType}`
                    : 'No coaches available'}
                </Text>
                {selectedTrainingType && (
                  <TouchableOpacity
                    style={styles.resetFilterButton}
                    onPress={() => selectTrainingType(null)}
                  >
                    <Text style={styles.resetFilterText}>Show all coaches</Text>
                  </TouchableOpacity>
                )}
              </View>
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
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 26, 0.98)',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: 'white',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 15,
    padding: 5,
    marginBottom: 5,
    textAlign: 'center'
  },
  debugText: {
    color: '#ffeb3b',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  searchContainer: {
    flex: 1,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 250,
  },
  dropdownMenu: {
    backgroundColor: '#1A1A2E',
    width: '90%',
    borderRadius: 8,
    padding: 20,
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#fff',
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
    elevation: 5,
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
  noCoachesContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  noCoaches: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetFilterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetFilterText: {
    color: '#fff',
    fontSize: 14,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Coaches;