import { View, Text, TouchableOpacity, Image, ScrollView, Animated, Dimensions, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const Matches = ({ visible = true, onClose }) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'short' });
  const year = currentDate.getFullYear();
  
  // Animation reference
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      // Reset position if needed
      slideAnim.setValue(0);
      opacity.setValue(0);
      
      // Start animations when visible
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Optional callback when animation completes
      });
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get('window').height, 0]
  });
  
  const events = [
    {
      id: 1,
      date: '21 March 2025',
      title: 'UMISF 2025',
      description: '31ST OF MARCH\n30TH OF MARCH',
      note: 'APPLICATIONS WILL OPENING SOON',
      color: '#f5a623',
      buttonText: 'Register'
    },
    {
      id: 2,
      date: '31 March 2025',
      title: 'K-Galic Tournament',
      buttonText: 'Register'
    },
    {
      id: 3,
      date: '15 April 2025',
      title: 'ALL ISLAND NOVICES SINGLES BADMINTON TOURNAMENT 2025',
      description: 'STAY TUNED',
      note: 'DATE: 15TH\nVENUE: MAIN HALL\nTIME: 08:00 AM',
      color: '#1e3a8a',
      buttonText: 'Coming Soon'
    }
  ];

  // If not visible and animation is complete, don't render
  if (!visible && slideAnim._value === 0) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          opacity: opacity,
        }
      ]}
    >
      <Animated.View 
        style={[
          styles.modalContent,
          {
            transform: [{ translateY: translateY }]
          }
        ]}
      >
        {/* Header with close button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Upcoming Matches</Text>
          <TouchableOpacity 
            onPress={() => {
              // Trigger close animation first
              Animated.parallel([
                Animated.timing(slideAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                })
              ]).start(() => {
                // Call onClose after animation completes
                onClose && onClose();
              });
            }} 
            style={styles.closeButton}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>{day}</Text>
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ color: 'gray', fontSize: 12 }}>WED</Text>
                    <Text style={{ color: 'white', fontSize: 14 }}>{month} {year}</Text>
                  </View>
                </View>
                <View style={styles.todayBadge}>
                  <Text style={{ color: '#121212', fontWeight: '500' }}>Today</Text>
                </View>
              </View>
            </View>

            {/* Timeline and Events */}
            <View>
              {events.map((event, index) => (
                <View key={event.id} style={{ marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    {/* Timeline */}
                    <View style={{ alignItems: 'center', width: 24, marginRight: 12 }}>
                      <View style={styles.timelineDot} />
                      {index < events.length - 1 && (
                        <View style={[
                          styles.timelineLine, 
                          { height: index === 0 ? 120 : 100 }
                        ]} />
                      )}
                    </View>

                    {/* Event Details */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: 'white', marginBottom: 8 }}>{event.date}</Text>
                      
                      {event.id === 2 ? (
                        <View style={styles.simpleEventCard}>
                          <Text style={{ color: 'white', fontWeight: '500' }}>{event.title}</Text>
                          <TouchableOpacity style={styles.greenButton}>
                            <Text style={{ color: '#121212', fontWeight: '500' }}>{event.buttonText}</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={[
                          styles.coloredEventCard,
                          { backgroundColor: event.color || '#1e1e24' }
                        ]}>
                          {event.id === 3 && (
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                              <View style={styles.badmintonHeader}>
                                <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                                  {event.title}
                                </Text>
                              </View>
                            </View>
                          )}
                          
                          <View style={{ 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            marginTop: event.id === 3 ? 50 : 0
                          }}>
                            <View style={{ flex: 1 }}>
                              {event.id !== 3 && (
                                <Text style={styles.eventTitle}>
                                  {event.title}
                                </Text>
                              )}
                              
                              {event.description && (
                                <Text style={{ 
                                  color: 'white', 
                                  marginBottom: 8,
                                  fontWeight: event.id === 1 ? 'bold' : 'normal'
                                }}>
                                  {event.description}
                                </Text>
                              )}
                              
                              {event.note && (
                                <Text style={{ color: 'white', fontSize: 12, opacity: 0.8 }}>
                                  {event.note}
                                </Text>
                              )}
                              
                              {event.id === 1 && (
                                <TouchableOpacity style={styles.redButton}>
                                  <Text style={{ color: 'white', fontWeight: '500' }}>{event.buttonText}</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                            
                            {event.image && event.id === 1 && (
                              <View style={{ width: 80, height: 100, position: 'absolute', right: 0, bottom: 0 }}>
                                <View style={{ width: 80, height: 100, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4 }} />
                              </View>
                            )}
                            
                            {event.image && event.id === 3 && (
                              <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'center' }}>
                                <View style={{ width: 120, height: 80, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4 }} />
                              </View>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0A0A1A',
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  calendarHeader: {
    backgroundColor: '#1e1e24',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  todayBadge: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
    marginBottom: 4,
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#3b82f6',
    opacity: 0.5,
  },
  simpleEventCard: {
    backgroundColor: '#1e1e24',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  coloredEventCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  badmintonHeader: {
    backgroundColor: '#0f2362',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  eventTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  greenButton: {
    backgroundColor: '#4ade80',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 12,
    width: 100,
  },
  redButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 12,
    width: 100,
  },
});

export default Matches;