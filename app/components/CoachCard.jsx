import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Easing,
  Linking,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import CoachAvailability from './CoachAvailability';

const CoachCard = ({ coach, visible, onRequestClose }) => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [showAvailability, setShowAvailability] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      setShowAvailability(false);
    }
  }, [visible]);

  if (!coach) return null;
  
  // Function to handle phone number click
  const handlePhoneCall = () => {
    const phoneNumber = `tel:${coach.Tel}`;
    Linking.openURL(phoneNumber).catch((err) => console.error('Error making the call:', err));
  };

  // Function to navigate to Courts screen with the selected court
  const navigateToCourt = (court) => {
    onRequestClose();
    navigation.navigate('court', { 
      selectedCourtId: court._id,
      courtName: court.CourtName
    });
  };

  // Handle booking completion
  const handleBooking = (bookingDetails) => {
    // Here you would typically make an API call to save the booking
    console.log('Booking details:', bookingDetails);
    
    // Show confirmation to user
    alert(`Booking confirmed with ${coach.CoachName} on ${bookingDetails.date} at ${bookingDetails.timeSlot.start}-${bookingDetails.timeSlot.end}`);
    
    // Close the modal after booking
    onRequestClose();
  };

  // Check if Courts are properly populated objects or just IDs
  const hasPopulatedCourts = coach.Courts?.length > 0 && 
    typeof coach.Courts[0] === 'object' && 
    coach.Courts[0] !== null &&
    coach.Courts[0].CourtName !== undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.name}>{coach.CoachName}</Text>
              <TouchableOpacity onPress={onRequestClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={{ uri: coach.CoachPhoto }}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>Phone</Text>
                <TouchableOpacity onPress={handlePhoneCall} style={styles.phonecontainer}>
                  <LottieView
                    source={require('../../assets/lottie/phone.json')}
                    autoPlay
                    loop
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={styles.infoText}>{coach.Tel}</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.infoColumn, styles.rightAligned]}>
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

            <View style={styles.section}>
              <Text style={styles.infoLabel}>Places</Text>
              <View style={styles.placesContainer}>
                {hasPopulatedCourts ? (
                  coach.Courts.map((court, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.placeItem}
                      onPress={() => navigateToCourt(court)}
                    >
                      <Text style={styles.placeLocation}>{court.place || 'Location'}</Text>
                      <Text style={styles.placeCourtClickable}>{court.CourtName}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.infoText}>No court information available</Text>
                )}
              </View>
            </View>

            {/* Toggle Availability Button */}
            <TouchableOpacity 
              style={styles.availabilityButton}
              onPress={() => setShowAvailability(!showAvailability)}
            >
              <Text style={styles.availabilityButtonText}>
                {showAvailability ? 'Hide Availability' : 'View Availability & Book'}
              </Text>
            </TouchableOpacity>

            {/* Availability Section */}
            {showAvailability && (
              <CoachAvailability 
                coach={coach} 
                onBooking={handleBooking}
              />
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '95%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
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
    fontSize: 20,
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
    backgroundColor: '#DDF',
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
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  placeLocation: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000',
  },
  placeCourtClickable: {
    fontSize: 12,
    color: '#4A80F0',
  },
  phonecontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5
  },
  availabilityButton: {
    backgroundColor: '#4A80F0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  availabilityButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  }
});

export default CoachCard;