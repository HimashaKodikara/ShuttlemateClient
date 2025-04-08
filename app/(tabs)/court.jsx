import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
const Courts = () => {
  const [court, setCourt] = useState([]);

  const fetchCourts = () => {
    axios.get(`${API_BASE_URL}/courts/`)
      .then(response => {
        setCourt(response.data.courts);
      })
      .catch(error => {
        console.error("Error Fetching data", error);
      });
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  // const openMaps = (location) => {
  //   const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
  //   Linking.openURL(url).catch(() => {
  //     Linking.openURL("https://play.google.com/store/apps/details?id=com.google.android.apps.maps");
  //     console.log(url);
  //   });
  // };

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Courts</Text>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>Select the area</Text>
          <Ionicons name="chevron-down" size={20} color="#fff" />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {court.map((court) => (
          <View key={court._id} style={styles.courtCard}>
            <Image source={{ uri: court.CourtPhoto }} style={styles.courtImage} />
            <View style={styles.courtInfo}>
              <Text style={styles.courtName}>{court.CourtName}</Text>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>{court.place}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>{court.Tel}</Text>
                </View>
              </View>

              <View style={styles.infoContainer}>
                <Ionicons name="cash-outline" size={20} color="#666" />
                <Text style={styles.infoText}>RS: {court.Priceperhour} Per Hour</Text>
              </View>

              <View style={styles.infoContainer}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.infoText}>{court.Openinghours}</Text>
              </View>

              <TouchableOpacity 
                style={styles.navigateButton}
                onPress={() => openMaps(6.905880,79.928961)} // Or use `${court.latitude},${court.longitude}` if available
              >
                <Ionicons name="navigate-outline" size={18} color="#fff" />
                <Text style={styles.navigateText}>Navigate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141424',
  },
  header: {
    padding: 16,
    paddingTop: 35,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownText: {
    color: '#999',
    fontSize: 16,
  },
  scrollView: {
    padding: 16,
  },
  courtCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courtImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  courtInfo: {
    padding: 16,
  },
  courtName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoText: {
    marginLeft: 12,
    color: '#666',
    fontSize: 14,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 12,
  },
  navigateText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default Courts;
