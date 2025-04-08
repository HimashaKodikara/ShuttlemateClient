import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const CoachCard = ({ coach }) => {
  // Handle case where no coach data is provided
  if (!coach) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header with name and close button */}
      <View style={styles.header}>
        <Text style={styles.name}>{coach.CoachName}</Text>
        <TouchableOpacity>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: coach.CoachPhoto }}
          style={styles.profileImage}
          // You can add a defaultSource here for fallback
        />
      </View>
      
      {/* Contact and Experience Info */}
      <View style={styles.infoRow}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoText}>{coach.Tel}</Text>
        </View>
        <View style={[styles.infoColumn, styles.rightAligned]}>
          <Text style={styles.infoLabel}>Coaching Experience</Text>
          <Text style={styles.infoText}>{coach.Experience || '5 Years'}</Text>
        </View>
      </View>
      
      {/* Training Types */}
      <View style={styles.section}>
        <Text style={styles.infoLabel}>Training For</Text>
        <View style={styles.specialtiesContainer}>
          {coach.TrainingType && coach.TrainingType.map((specialty, index) => (
            <Text key={index} style={styles.specialty}>
              {specialty}{index < coach.TrainingType.length - 1 ? ' | ' : ''}
            </Text>
          ))}
        </View>
      </View>
      
      {/* Certificates */}
      <View style={styles.section}>
        <Text style={styles.infoLabel}>Certificates</Text>
        {coach.Certificates ? 
          coach.Certificates.map((certificate, index) => (
            <Text key={index} style={styles.certificate}>{certificate}</Text>
          )) : 
          // Fallback certificates if not provided
          ['Completed BWF Level I courses', 
           'Completed SLB Basic Level',
           'Completed SLB level One', 
           'Completed SLB level Two'].map((cert, idx) => (
            <Text key={idx} style={styles.certificate}>{cert}</Text>
          ))
        }
      </View>
      
      {/* Training Areas/Places */}
      <View style={styles.section}>
        <Text style={styles.infoLabel}>Places</Text>
        <View style={styles.placesContainer}>
          {coach.TrainingAreas && coach.TrainingAreas.map((area, index) => (
            <View key={index} style={styles.placeItem}>
              <Text style={styles.placeLocation}>{area.Location || 'Location'}</Text>
              <Text style={styles.placeCourt}>{area.CourtName}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    fontSize: 18,
    color: '#777',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DDF', // Placeholder background color
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoColumn: {
    flex: 1,
  },
  rightAligned: {
    alignItems: 'flex-end',
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#000',
  },
  section: {
    marginBottom: 16,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialty: {
    fontSize: 13,
    color: '#000',
  },
  certificate: {
    fontSize: 13,
    color: '#000',
    marginBottom: 2,
  },
  placesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  placeItem: {
    width: '48%',
    marginBottom: 8,
  },
  placeLocation: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
  placeCourt: {
    fontSize: 12,
    color: '#777',
  }
});

export default CoachCard;