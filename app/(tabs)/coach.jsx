import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);

  const fetchCoaches = () => {
    axios.get(`${API_BASE_URL}/Coachers/`)
      .then(response => {
        // Change from response.data.coaches to response.data.coachers
        setCoaches(response.data.coachers);
       
      })
      .catch(error => {
        console.error("Error Fetching data", error);
      });
  };

  
  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Coaches</Text>
      
      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Select the coach requirement type</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.coachList}>
        {coaches && coaches.length > 0 ? coaches.map((coach) => (
          <View key={coach._id} style={styles.coachCard}>
            <Image 
              source={{ uri: coach.CoachPhoto }}
              style={styles.coachImage}
              //defaultSource={require('../assets/images/default-avatar.jpg')}
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
                {coach.TrainingAreas && coach.TrainingAreas.map((area, index) => (
                  <Text key={index} style={styles.level}>
                    {area.CourtName}{index < coach.TrainingAreas.length - 1 ? ' | ' : ''}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )) : (
          <Text style={styles.noCoaches}>No coaches available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141424',
    padding: 16,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginTop:30
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#333', // Placeholder background
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    color: 'black',
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
    color: 'black',
    fontSize: 12,
  },
  contactNumber: {
    color: 'black',
    fontSize: 12,
    marginBottom: 4,
  },
  levelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  level: {
    color: 'black',
    fontSize: 12,
  },
  noCoaches: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default Coaches;