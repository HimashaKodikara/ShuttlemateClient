import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Linking, 
  ActivityIndicator,
  RefreshControl,
  Modal,
  FlatList,
  ImageBackground
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
import LottieView from 'lottie-react-native';
import { useRoute } from '@react-navigation/native';
import bg from '../../assets/backgorundimg.jpg'
import CourtAvailability from '../components/CourtAvailability';

const Courts = () => {
  const route = useRoute();
  const scrollViewRef = useRef(null);
  const courtRefs = useRef({});

  const [courts, setCourts] = useState([]);
  const [allCourts, setAllCourts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  
  // Changed to object to track availability for each court individually
  const [expandedCourts, setExpandedCourts] = useState({});

  const onRefresh = async () => {
    setRefreshing(true);
    fetchCourts();
     setExpandedCourts({});

    setRefreshing(false);
  };

  // Updated function to handle phone number click with the court's phone number
  const handlePhoneCall = (phoneNumber) => {
    const formattedPhoneNumber = `tel:${phoneNumber}`;
    Linking.openURL(formattedPhoneNumber).catch((err) => console.error('Error making the call:', err));
  };

  const fetchCourts = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/courts/`)
      .then(response => {
        const courtsData = response.data.courts;
        setAllCourts(courtsData);
        setCourts(courtsData);
        
        // Extract unique areas from courts data
        const uniqueAreas = [...new Set(courtsData.map(court => court.place))];
        setAreas(['All Areas', ...uniqueAreas]);
        
        setLoading(false);
        
        // If there's a selected court from navigation, set it
        if (route.params?.selectedCourtId) {
          setSelectedCourtId(route.params.selectedCourtId);
        }
      })
      .catch(error => {
        console.error("Error Fetching data", error);
        setError("Failed to load courts. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  useEffect(() => {
    if (!loading && selectedCourtId && courtRefs.current[selectedCourtId] && scrollViewRef.current) {
      setTimeout(() => {
        courtRefs.current[selectedCourtId].measure((fx, fy, width, height, px, py) => {
          scrollViewRef.current.scrollTo({
            y: py - 100, 
            animated: true,
          });
        });
      }, 100);
    }
  }, [loading, selectedCourtId, courts]);

  const openMaps = (latitude, longitude) => {
    const url = `google.navigation:q=${latitude},${longitude}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to web URL if native maps app isn't available
          const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
          return Linking.openURL(webUrl);
        }
      })
      .catch(err => {
        console.error('An error occurred', err);
        Linking.openURL("https://play.google.com/store/apps/details?id=com.google.android.apps.maps");
      });
  };

  const handleBooking = (bookingDetails, court) => {
    
    alert(`Booking request sent on ${bookingDetails.date} at ${bookingDetails.timeSlot.start}-${bookingDetails.timeSlot.end}. Please wait for the confirmation from the court owner.`);

    setExpandedCourts(prev => ({
      ...prev,
      [court._id]: false
    }));
  };

  const toggleAvailability = (courtId) => {
    setExpandedCourts(prev => ({
      ...prev,
      [courtId]: !prev[courtId]
    }));
  };

  const selectArea = (area) => {
    setSelectedArea(area);
    setShowAreaDropdown(false);
    
    if (area === 'All Areas') {
      setCourts(allCourts);
    } else {
      const filteredCourts = allCourts.filter(court => court.place === area);
      setCourts(filteredCourts);
    }
  };

  if (loading) {
    return (
      <ImageBackground
            source={bg}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            
      <SafeAreaView style={styles.container}>
        
      <View style={[styles.container, styles.centered]}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading courts...</Text>
            </View>
      </SafeAreaView>
    
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Courts</Text>
          <TouchableOpacity style={styles.dropdown} disabled>
            <Text style={styles.dropdownText}>Select the area</Text>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCourts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Courts
        </Text>
        <TouchableOpacity 
          style={styles.dropdown}
          onPress={() => setShowAreaDropdown(true)}
        >
          <Text style={[
            styles.dropdownText,
            selectedArea !== 'All Areas' && styles.activeDropdownText
          ]}>
            {selectedArea}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {courts.length > 0 ? (
          courts.map((court) => (
            <View key={court._id}>
              <TouchableOpacity 
                style={[
                  styles.courtCard,
                  selectedCourtId === court._id && styles.highlightedCard
                ]} 
                activeOpacity={0.92}
                ref={ref => courtRefs.current[court._id] = ref}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: court.CourtPhoto }} style={styles.courtImage} />
                  <View style={styles.courtImageOverlay}>
                    <View style={styles.priceBadge}>
                      <Ionicons name="cash-outline" size={16} color="#fff" />
                      <Text style={styles.priceText}>Rs. {court.Priceperhour}/hr</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.courtInfo}>
                  <Text style={styles.courtName}>{court.CourtName}</Text>

                  <View style={styles.infoSection}>
                    <View style={styles.infoContainer}>
                      <Ionicons name="location-outline" size={18} color="#fff" />
                      <Text style={styles.infoText}>{court.place}</Text>
                    </View>

                    <View style={styles.infoContainer}>
                     <TouchableOpacity 
                       onPress={() => handlePhoneCall(court.Tel)} 
                       style={styles.phoneContainer}
                     >
                      <Ionicons name="call-outline" size={18} color="#fff" />
                      <Text style={styles.infoText}>{court.Tel}</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.infoContainer}>
                      <Ionicons name="time-outline" size={18} color="#fff" />
                      <Text style={styles.infoText}>{court.Openinghours}</Text>
                    </View>
                  </View>

                  <View style={styles.facilityContainer}>
                    <Text style={styles.facilitiesTitle}>Facilities</Text>
                    <View style={styles.facilitiesRow}>
                      <View style={styles.facilityBadge}>
                        <Ionicons name="water-outline" size={14} color="#fff" />
                        <Text style={styles.facilityText}>Water</Text>
                      </View>
                      <View style={styles.facilityBadge}>
                        <Ionicons name="car-outline" size={14} color="#fff" />
                        <Text style={styles.facilityText}>Parking</Text>
                      </View>
                      <View style={styles.facilityBadge}>
                        <Ionicons name="restaurant-outline" size={14} color="#fff" />
                        <Text style={styles.facilityText}>Cafe</Text>
                      </View>
                    </View>
                  </View>

                  {/* Action buttons container */}
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={styles.navigateButton}
                      onPress={() => {
                        if (court.Directions && court.Directions.length > 0) {
                          openMaps(court.Directions[0].latitude, court.Directions[0].longitude);
                        } else {
                          console.warn("No directions available for this court.");
                        }
                      }}
                    >
                      <Ionicons name="navigate-outline" size={18} color="#fff" />
                      <Text style={styles.navigateText}>Navigate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.availabilityButton}
                      onPress={() => toggleAvailability(court._id)}
                    >
                      <Ionicons 
                        name={expandedCourts[court._id] ? "calendar" : "calendar-outline"} 
                        size={18} 
                        color="#fff" 
                      />
                      <Text style={styles.availabilityButtonText}>
                        {expandedCourts[court._id] ? 'Hide Availability' : 'View Availability'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Availability Section - Now outside the card and full width */}
              {expandedCourts[court._id] && (
                <View style={styles.fullWidthAvailabilitySection}>
                  <CourtAvailability 
                    court={court} 
                    onBooking={(bookingDetails) => handleBooking(bookingDetails, court)}
                  />
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="basketball-outline" size={60} color="#666" />
            <Text style={styles.noDataText}>No courts available in {selectedArea}</Text>
            {selectedArea !== 'All Areas' && (
              <TouchableOpacity 
                style={styles.resetFilterButton}
                onPress={() => selectArea('All Areas')}
              >
                <Text style={styles.resetFilterText}>Show all courts</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Area selection modal */}
      <Modal
        visible={showAreaDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAreaDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAreaDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Area</Text>
            <FlatList
              data={areas}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.areaItem,
                    selectedArea === item && styles.selectedAreaItem
                  ]}
                  onPress={() => selectArea(item)}
                >
                  <Text style={[
                    styles.areaItemText,
                    selectedArea === item && styles.selectedAreaItemText
                  ]}>
                    {item}
                  </Text>
                  {selectedArea === item && (
                    <Ionicons name="checkmark" size={20} color="#4A80F0" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.areasList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingBottom:180
  },
  header: {
    padding: 7,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:350
  },
   loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  headerTitle: {
     color: 'white',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop:20,
    padding: 5,
    marginBottom:10,
    textAlign:'center'
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#333',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  dropdownText: {
    color: '#999',
    fontSize: 15,
    fontWeight: '500',
  },
  activeDropdownText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    padding: 7,
  },
  courtCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#4A80F0',
    shadowColor: '#4A80F0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  courtImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  courtImageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 12,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a237e',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  priceText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 4,
    fontSize: 14,
  },
  courtInfo: {
    padding: 16,
  },
  courtName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
    color: '#bbb',
    fontSize: 14,
  },
  facilityContainer: {
    marginBottom: 16,
  },
  facilitiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  // New container for action buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a237e',
    borderRadius: 12,
    paddingVertical: 12,
  },
  navigateText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  // New availability button styles
  availabilityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745',
    borderRadius: 12,
    paddingVertical: 12,
  },
  availabilityButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
  // Updated full width availability section styles
  fullWidthAvailabilitySection: {
    marginHorizontal: 7, // Match scrollView padding
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  // Loader styles
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // No data styles
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    color: '#888',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  resetFilterButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(74, 128, 240, 0.2)',
    borderRadius: 20,
  },
  resetFilterText: {
    color: '#4A80F0',
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  areasList: {
    maxHeight: 400,
  },
  areaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedAreaItem: {
    backgroundColor: 'rgba(74, 128, 240, 0.1)',
  },
  areaItemText: {
    color: '#ccc',
    fontSize: 16,
  },
  selectedAreaItemText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Courts;