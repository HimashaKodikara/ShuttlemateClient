import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking, ActivityIndicator,RefreshControl } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
import LottieView from 'lottie-react-native';
import Matches from '../components/Matches';
import { useRoute } from '@react-navigation/native';

const Courts = () => {
  const route = useRoute();
  const scrollViewRef = useRef(null);
  const courtRefs = useRef({});

  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMatches, setShowMatches] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const[refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data
    fetchCourts();
    setRefreshing(false);
  }

  const fetchCourts = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/courts/`)
      .then(response => {
        setCourts(response.data.courts);
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
        // Ultimate fallback - open Play Store to download Maps
        Linking.openURL("https://play.google.com/store/apps/details?id=com.google.android.apps.maps");
      });
  };

  const toggleMatches = () => {
    setShowMatches(!showMatches);
  };

  // Display loader while data is being fetched
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Courts</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Select the area</Text>
            <Ionicons name="chevron-down" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A80F0" />
        </View>
      </SafeAreaView>
    );
  }

  // Display error state if there's an error
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Courts</Text>
          <TouchableOpacity style={styles.dropdown}>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
        Courts
        </Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Select the area</Text>
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
            <TouchableOpacity 
              key={court._id} 
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
                    <Ionicons name="call-outline" size={18} color="#fff" />
                    <Text style={styles.infoText}>{court.Tel}</Text>
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
              </View>
              
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="basketball-outline" size={60} color="#666" />
            <Text style={styles.noDataText}>No courts available</Text>
          </View>
        )}
      </ScrollView>
      
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  header: {
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
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
  scrollView: {
    padding: 16,
  },
  courtCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
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
    backgroundColor: 'rgba(74, 128, 240, 0.9)',
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
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A80F0',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  navigateText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
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

export default Courts;