import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
import { Linking } from 'react-native';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'short' });
  const year = currentDate.getFullYear();

  // Fetch matches data from API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/matches/`);
  
        if (response.data.success) {
          const currentDate = new Date();
  
          const filteredAndSortedMatches = response.data.matches
            .filter(match => {
              const endDate = match.EndDate ? new Date(match.EndDate) : null;
              // If endDate exists, compare it with currentDate
              return !endDate || endDate >= currentDate;
            })
            .sort((a, b) => new Date(a.StartDate) - new Date(b.StartDate));
  
          setMatches(filteredAndSortedMatches);
        } else {
          setError('Failed to fetch matches');
        }
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchMatches();
  }, []);
  
  // Helper function to determine card color based on match name
  const getCardColor = (matchName) => {
    if (matchName.includes('BADMINTON') || matchName.includes('Badminton')) {
      return '#1e1e24';
    } else if (matchName.includes('UMISF')) {
      return '#1e1e24';
    } else {
      return '#1e1e24';
    }
  };

  // Format date string to display properly
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Matches</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>{day}</Text>
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ color: 'gray', fontSize: 12 }}>
                    {currentDate.toLocaleString('default', { weekday: 'short' }).toUpperCase()}
                  </Text>
                  <Text style={{ color: 'white', fontSize: 14 }}>{month} {year}</Text>
                </View>
              </View>
              <View style={styles.todayBadge}>
                <Text style={{ color: '#121212', fontWeight: '500' }}>Today</Text>
              </View>
            </View>
          </View>

          {/* Loading, Error, or Events */}
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loaderText}>Loading matches...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={40} color="#d32f2f" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  setLoading(true);
                  setError(null);
                  // Re-fetch data
                  axios.get(`${API_BASE_URL}/matches`)
                    .then(response => {
                      if (response.data.success) {
                        setMatches(response.data.matches);
                      } else {
                        setError('Failed to fetch matches');
                      }
                    })
                    .catch(err => {
                      console.error('Error fetching matches:', err);
                      setError('Network error. Please try again.');
                    })
                    .finally(() => setLoading(false));
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : matches.length === 0 ? (
            <View style={styles.noMatchesContainer}>
              <MaterialIcons name="event-busy" size={40} color="#888" />
              <Text style={styles.noMatchesText}>No upcoming matches found</Text>
            </View>
          ) : (
            <View>
              {matches.map((match, index) => {
                const cardColor = getCardColor(match.MatchName);
                const isUMISF = match.MatchName.includes('UMISF');
                
                return (
                  <View key={match._id || index} style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      {/* Timeline */}
                      <View style={{ alignItems: 'center', width: 24, marginRight: 12 }}>
                        <View style={styles.timelineDot} />
                        {index < matches.length - 1 && (
                          <View style={[
                            styles.timelineLine, 
                            { height: 300 }
                          ]} />
                        )}
                      </View>

                      {/* Event Details */}
                      <View style={{ flex: 1 }}>
                        {/* Always display formatted start date */}
                        <Text style={styles.dateText}>{formatDate(match.StartDate)}</Text>
                        
                        <View style={[
                          styles.matchCard,
                          { backgroundColor: cardColor }
                        ]}>
                          <View style={styles.photoContainer}>
                            {match.MatchPhoto ? (
                              <Image 
                                source={{ uri: match.MatchPhoto }} 
                                style={styles.matchPhoto}
                                resizeMode="cover"
                              />
                            ) : (
                              <View style={styles.placeholderPhoto}>
                                <MaterialIcons name="image-not-supported" size={24} color="#999" />
                              </View>
                            )}
                          </View>
                          {/* Match Name - Always displayed prominently */}
                          <Text style={styles.matchName}>
                            {match.MatchName}
                          </Text>
                          
                          {/* Date information */}
                          <View style={styles.dateContainer}>
                            <View style={styles.dateRow}>
                              <MaterialIcons name="event" size={16} color="white" />
                              <Text style={styles.dateLabel}>Open: </Text>
                              <Text style={styles.dateValue}>{formatDate(match.StartDate)}</Text>
                            </View>
                            
                            {match.EndDate && (
                              <View style={styles.dateRow}>
                                <MaterialIcons name="event" size={16} color="white" />
                                <Text style={styles.dateLabel}>Close: </Text>
                                <Text style={styles.dateValue}>{formatDate(match.EndDate)}</Text>
                              </View>
                            )}
                          </View>

                          {/* Register button */}
                          {match.Weblink && (
                            <TouchableOpacity 
                              style={styles.greenButton}
                              onPress={() => {
                                Linking.openURL(match.Weblink).catch(err => {
                                  console.error('Error opening URL:', err);
                                });
                              }}
                            >
                              <Text style={{ fontWeight: '500' }}>Register</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  header: {
  
    alignItems: 'center',
    padding: 16,
  
  },
  headerTitle: {
   color: 'white',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop:30,
    padding: 5,
 
    textAlign:'center'
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom:50,
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
  dateText: {
    color: 'white',
    marginBottom: 8,
    fontWeight: '500',
  },
  matchCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor:'white'
  },
  matchName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  dateContainer: {
    marginVertical: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateLabel: {
    color: 'white',
    marginLeft: 4,
    opacity: 0.9,
    fontWeight: '500',
  },
  dateValue: {
    color: 'white',
    opacity: 0.9,
  },
  photoContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  matchPhoto: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  placeholderPhoto: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenButton: {
    backgroundColor: '#4ade80',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loaderText: {
    color: 'white',
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    color: 'white',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  noMatchesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noMatchesText: {
    color: 'white',
    marginTop: 12,
    textAlign: 'center',
  }
});

export default Matches;