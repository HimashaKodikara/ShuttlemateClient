import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CoachAvailability = ({ coach, onBooking }) => {
  // Get current date and format it as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [userId, setUserId] = useState(null);

  // Generate dates for the next 7 days
  const weekDates = Array(7)
    .fill(0)
    .map((_, index) => {
      const date = new Date();
      date.setDate(today.getDate() + index);

      return {
        date: formatDate(date),
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        dayNum: date.getDay(), // 0-6 representing Sunday-Saturday
        dayOfMonth: date.getDate(),
      };
    });

  // Fetch user data from session/storage
  const fetchUserData = async () => {
    try {
      // Get firebaseUid from AsyncStorage (session)
      const firebaseUid = await AsyncStorage.getItem('firebaseUid');
      
      if (!firebaseUid) {
        console.error('No firebaseUid found in session');
        Alert.alert(
          'Login Required',
          'Please log in to book a coaching session',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Go to Login',
              onPress: () => {
                // You may need to adjust this navigation based on your app's structure
                // If using React Navigation, you might use navigation.navigate('SignIn')
                // Current implementation assumes you have a router object like in your example
                if (typeof router !== 'undefined' && router.replace) {
                  router.replace('/sign-in');
                }
              },
            },
          ]
        );
        return null;
      }
      
      // Use the user endpoint to get user data based on firebaseUid
      const response = await axios.get(`${API_BASE_URL}/user/${firebaseUid}`);
      
      if (response.data && response.data._id) {
        setUserId(response.data._id);
        return response.data._id;
      } else {
        console.error('User data not found or incomplete');
        return null;
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      console.log('Error response:', err.response);
      Alert.alert(
        'Error',
        'Failed to load your user information. Please try again later.'
      );
      return null;
    }
  };

  // Fetch availability data from backend
  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/Coachers/${coach._id}/availability`
      );

      if (response.data.success) {
        // Process the availability data
        processAvailabilityData(response.data.data);
      } else {
        setError('Failed to fetch availability data');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Error fetching coach availability:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch user data and availability when component mounts
    const initialize = async () => {
      setLoading(true);
      try {
        // Get firebaseUid from AsyncStorage
        const storedFirebaseUid = await AsyncStorage.getItem('firebaseUid');
        
        if (!storedFirebaseUid) {
          console.log('No user ID found in storage');
          Alert.alert(
            'Login Required',
            'Please log in to book a coaching session',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Go to Login',
                onPress: () => {
                  // Navigate to sign-in page
                  if (typeof router !== 'undefined' && router.replace) {
                    router.replace('/sign-in');
                  }
                },
              },
            ]
          );
          return;
        }
        
        // Fetch user data using the Firebase UID
        const response = await axios.get(`${API_BASE_URL}/user/${storedFirebaseUid}`);
        if (response.data && response.data._id) {
          setUserId(response.data._id);
        }
        
        // Fetch availability data
        await fetchAvailability();
      } catch (err) {
        console.error('Error during initialization:', err);
        setError('Failed to initialize. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
  }, [coach._id]);

  // Process availability data from backend and organize it by date
  const processAvailabilityData = (availabilityData) => {
    const processedAvailability = {};

    // For each of the next 7 days
    weekDates.forEach(dayInfo => {
      // Find slots for this day of week
      const daySlots = availabilityData.filter(
        slot => slot.dayOfWeek === dayInfo.dayNum && slot.isRecurring
      );
      
      // Check for existing bookings on this date
      const existingBookings = coach.bookings ? coach.bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        const bookingDateStr = formatDate(bookingDate);
        return bookingDateStr === dayInfo.date && booking.status !== 'cancelled';
      }) : [];
      
      // Convert to time slots format
      processedAvailability[dayInfo.date] = daySlots.map((slot, idx) => {
        // Check if this slot is booked
        const isBooked = existingBookings.some(booking => 
          booking.startTime <= slot.startTime && booking.endTime >= slot.endTime
        );
        
        return {
          id: `${dayInfo.date}-${idx}`,
          start: slot.startTime,
          end: slot.endTime,
          available: !isBooked,
        };
      });
    });

    setAvailability(processedAvailability);
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    return availability[selectedDate] || [];
  };

  // Handle booking request
  const handleBooking = async () => {
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    // Check if we have user ID
    if (!userId) {
      Alert.alert('Error', 'Unable to identify user. Please log in again.');
      return;
    }

    try {
      setBookingInProgress(true);
      
      // Get the selected date
      const bookingDate = selectedDate;
      
      const courtId = null; 
      const notes = ""; 
      
      // Create booking payload
      const bookingData = {
        date: bookingDate,
        startTime: selectedTimeSlot.start,
        endTime: selectedTimeSlot.end,
        userId: userId, // Use the userId from state instead of hardcoded value
        courtId,
        notes,
      };
      
      // Send booking request to the server
      const response = await axios.post(
        `${API_BASE_URL}/Coachers/${coach._id}/bookings`,
        bookingData
      );
      
      if (response.data.success) {
        // Success! Refresh availability data
        await fetchAvailability();
        
        // Reset selection after booking
        setSelectedTimeSlot(null);
        
        // Notify parent component
        onBooking({
          coachId: coach._id,
          coachName: coach.CoachName,
          date: bookingDate,
          timeSlot: selectedTimeSlot,
          bookingId: response.data.data._id,
        });
        
       
      } else {
        // Show error message
        Alert.alert(
          'Booking Failed',
          response.data.message || 'Failed to book session',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.error('Error booking session:', err);
      
      // Show error message
      Alert.alert(
        'Booking Error',
        err.response?.data?.message || 'An error occurred while booking your session',
        [{ text: 'OK' }]
      );
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4A80F0" />
        <Text style={styles.loadingText}>Loading availability...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            // Re-fetch availability
            fetchAvailability();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Coach Availability</Text>

      {/* Day selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {weekDates.map((day) => (
          <TouchableOpacity
            key={day.date}
            style={[
              styles.dateItem,
              selectedDate === day.date && styles.selectedDateItem,
            ]}
            onPress={() => setSelectedDate(day.date)}
          >
            <Text style={[
              styles.dayText,
              selectedDate === day.date && styles.selectedDateText,
            ]}>
              {day.day}
            </Text>
            <Text style={[
              styles.dateText,
              selectedDate === day.date && styles.selectedDateText,
            ]}>
              {day.dayOfMonth}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time slots */}
      <View style={styles.timeSlotsContainer}>
        <Text style={styles.timeSlotsTitle}>Available Time Slots</Text>
        
        {getAvailableTimeSlots().length === 0 ? (
          <Text style={styles.noSlotsText}>No time slots available for this day</Text>
        ) : (
          <View style={styles.timeSlotsList}>
            {getAvailableTimeSlots().map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  !slot.available && styles.unavailableSlot,
                  selectedTimeSlot?.id === slot.id && styles.selectedTimeSlot,
                ]}
                onPress={() => slot.available && setSelectedTimeSlot(slot)}
                disabled={!slot.available}
              >
                <Text style={[
                  styles.timeSlotText,
                  !slot.available && styles.unavailableSlotText,
                  selectedTimeSlot?.id === slot.id && styles.selectedTimeSlotText,
                ]}>
                  {slot.start} - {slot.end}
                </Text>
                {!slot.available && (
                  <Text style={styles.bookedText}>Booked</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Booking button */}
      <TouchableOpacity 
        style={[
          styles.bookButton,
          (!selectedTimeSlot || bookingInProgress) && styles.disabledButton,
        ]}
        onPress={handleBooking}
        disabled={!selectedTimeSlot || bookingInProgress}
      >
        {bookingInProgress ? (
          <View style={styles.bookingProgress}>
            <ActivityIndicator size="small" color="white" />
            <Text style={[styles.bookButtonText, styles.bookingProgressText]}>Booking...</Text>
          </View>
        ) : (
          <Text style={styles.bookButtonText}>Book Session</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#e53935',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  dateScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedDateItem: {
    backgroundColor: '#4A80F0',
  },
  dayText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedDateText: {
    color: 'white',
  },
  timeSlotsContainer: {
    marginBottom: 20,
  },
  timeSlotsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  noSlotsText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  timeSlotsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTimeSlot: {
    backgroundColor: '#4A80F0',
    borderColor: '#4A80F0',
  },
  unavailableSlot: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  unavailableSlotText: {
    color: '#999',
  },
  bookedText: {
    fontSize: 12,
    color: '#e53935',
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: '#4A80F0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#b0bec5',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingProgressText: {
    marginLeft: 8,
  },
});

export default CoachAvailability;