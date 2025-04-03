import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Courts = () => {
  const courts = [
    {
      id: '1',
      name: 'Bambarandage Indoor Court',
      location: 'Piliyanadala',
      phone: '+94 76 720 6520',
     // image: require('../assets/bambarandage-court.jpg')
    },
    {
      id: '2',
      name: 'Aspire Badminton',
      location: 'Piliyanadala',
      phone: '+94 76 837 3038',
      //image: require('../assets/aspire-badminton.jpg')
    },
    {
      id: '3',
      name: 'Vitech Sports',
      location: 'Malabe',
      phone: '+94 77 123 4567',
      //image: require('../assets/vitech-sports.jpg')
    }
  ];

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
        {courts.map((court) => (
          <TouchableOpacity key={court.id} style={styles.courtCard}>
            <Image source={court.image} style={styles.courtImage} />
            <View style={styles.courtInfo}>
              <Text style={styles.courtName}>{court.name}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.locationText}>{court.location}</Text>
              </View>
              <View style={styles.phoneContainer}>
                <Ionicons name="call-outline" size={16} color="#666" />
                <Text style={styles.phoneText}>{court.phone}</Text>
              </View>
            </View>
          </TouchableOpacity>
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
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
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
    marginBottom: 16,
  },
  courtImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  courtInfo: {
    padding: 12,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
});

export default Courts;