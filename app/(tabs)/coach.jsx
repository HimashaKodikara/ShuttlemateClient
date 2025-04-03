import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';

const Coaches = () => {
  const coaches = [
    {
      id: 1,
      name: 'Ruchira Jayaruwan',
      //image: require('../assets/images/coach1.jpg'),
      specialties: ['Plyometrics', 'Mobility', 'Strength'],
      contactNumber: '+94 70 123 4567',
      levels: ['Beginners', 'Intermediate'],
    },
    {
      id: 2,
      name: 'Tharindu Ambegoda',
     // image: require('../assets/images/coach2.jpg'),
      specialties: ['Kettlebell', 'Cardio', 'Strength'],
      contactNumber: '+94 77 887 4858',
      levels: ['Intermediate', 'Professional'],
    },
    {
      id: 3,
      name: 'Bhagya Ranasinghe',
     // image: require('../assets/images/coach3.jpg'),
      specialties: ['Cardio', 'Recovery', 'Yoga'],
      contactNumber: '+94 76 599 7554',
      levels: ['Beginners'],
    },
  ];

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
        {coaches.map((coach) => (
          <View key={coach.id} style={styles.coachCard}>
            <Image 
              source={coach.image}
              style={styles.coachImage}
              //defaultSource={require('../assets/images/default-avatar.jpg')}
            />
            
            <View style={styles.coachInfo}>
              <Text style={styles.coachName}>{coach.name}</Text>
              
              <View style={styles.specialtiesContainer}>
                {coach.specialties.map((specialty, index) => (
                  <Text key={index} style={styles.specialty}>
                    {specialty}{index < coach.specialties.length - 1 ? ' | ' : ''}
                  </Text>
                ))}
              </View>
              
              <Text style={styles.contactNumber}>{coach.contactNumber}</Text>
              
              <View style={styles.levelsContainer}>
                {coach.levels.map((level, index) => (
                  <Text key={index} style={styles.level}>
                    {level}{index < coach.levels.length - 1 ? ' | ' : ''}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
  },
  dropdownText: {
    color: '#888',
    fontSize: 14,
  },
  dropdownIcon: {
    color: '#888',
    fontSize: 12,
  },
  coachList: {
    flex: 1,
  },
  coachCard: {
    backgroundColor: '#222',
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
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  specialty: {
    color: '#aaa',
    fontSize: 12,
  },
  contactNumber: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
  },
  levelsContainer: {
    flexDirection: 'row',
  },
  level: {
    color: '#aaa',
    fontSize: 12,
  },
});

export default Coaches;