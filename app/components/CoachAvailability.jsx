import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

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
  
  // Generate dates for the next 7 days
  const weekDates = Array(7)
    .fill(0)
    .map((_, index) => {
      const date = new Date();
      date.setDate(today.getDate() + index);
      
      return {
        date: formatDate(date),
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        dayOfMonth: date.getDate(),
      };
    });

  // Mock data for coach availability - in a real app, this would come from a backend
  // This would be fetched based on the coach ID and selected date
  const mockAvailability = {
    // Format: { [date]: [timeSlots] }
  };
  
  // Create mock data for each day
  weekDates.forEach(dayInfo => {
    mockAvailability[dayInfo.date] = [
      // Generate some random time slots for each day
      { id: `${dayInfo.date}-1`, start: '09:00', end: '10:00', available: Math.random() > 0.3 },
      { id: `${dayInfo.date}-2`, start: '10:00', end: '11:00', available: Math.random() > 0.5 },
      { id: `${dayInfo.date}-3`, start: '14:00', end: '15:00', available: Math.random() > 0.3 },
      { id: `${dayInfo.date}-4`, start: '15:00', end: '16:00', available: Math.random() > 0.4 },
      { id: `${dayInfo.date}-5`, start: '16:00', end: '17:00', available: Math.random() > 0.2 },
    ].filter((_, idx) => {
      // Randomly remove some slots to make the schedule look more realistic
      return Math.random() > 0.3 || idx < 2; // Ensure at least 2 slots per day
    });
  });

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    return mockAvailability[selectedDate] || [];
  };

  // Handle booking request
  const handleBooking = () => {
    if (!selectedTimeSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    // Call the onBooking callback with booking details
    onBooking({
      coachId: coach._id,
      coachName: coach.CoachName,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
    });

    // Reset selection after booking
    setSelectedTimeSlot(null);
  };

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
          !selectedTimeSlot && styles.disabledButton,
        ]}
        onPress={handleBooking}
        disabled={!selectedTimeSlot}
      >
        <Text style={styles.bookButtonText}>Book Session</Text>
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
});

export default CoachAvailability;