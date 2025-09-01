import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
import { Linking } from 'react-native';
import bg from '../../assets/backgorundimg.jpg'


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

  const getCardColor = (matchName) => {
    if (matchName.includes('BADMINTON') || matchName.includes('Badminton')) {
      return 'rgba(30, 30, 36, 0.9)'; 
    } else if (matchName.includes('UMISF')) {
      return 'rgba(30, 30, 36, 0.9)';
    } else {
      return 'rgba(30, 30, 36, 0.9)';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };

  return (
    <ImageBackground
      source={bg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
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

                          <View style={{ flex: 1 }}>
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
                              <Text style={styles.matchName}>
                                {match.MatchName}
                              </Text>

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
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 26, 0.98)',
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 20,
    padding: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)', 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  calendarHeader: {
    backgroundColor: 'rgba(30, 30, 36, 0.85)', 
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', 
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
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  timelineLine: {
    width: 2,
    backgroundColor: '#3b82f6',
    opacity: 0.6,
  },
  dateText: {
    color: 'white',
    marginBottom: 8,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  matchCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5, 
  },
  matchName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  loaderText: {
    color: 'white',
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  errorText: {
    color: 'white',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  noMatchesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  noMatchesText: {
    color: 'white',
    marginTop: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }
});

export default Matches;