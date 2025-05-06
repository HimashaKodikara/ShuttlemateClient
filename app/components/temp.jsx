// Shop.js - Fixed component
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView,RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
import ShopCard from '../components/ShopCard';
import Matches from '../components/Matches';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';

const Shop = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
    const[refreshing, setRefreshing] = useState(false);
  

    const onRefresh = async () => {
      setRefreshing(true);
      // Refresh data
      fetchShops();
      setRefreshing(false);
    }

  const fetchShops = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/shops/`)
      .then(response => {
        setShops(response.data.shops);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error Fetching data", error);
        setError("Failed to load shops. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShops();
  }, []);


  useFocusEffect(
    useCallback(() => {
     
      setModalVisible(false);
      setSelectedShop(null);
      
      return () => {
    
      };
    }, [])
  );

  const openModal = (shop) => {
    setSelectedShop(shop);
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
    setSelectedShop(null);
  }
  
  const toggleMatches = () => {
    setShowMatches(!showMatches);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Shops</Text>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A80F0" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Shops</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchShops}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Shops</Text>

      <ScrollView style={styles.shopsList} showsVerticalScrollIndicator={false}
      refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }>
        {shops && shops.length > 0 ? (
          shops.map((shop) => (
            <TouchableOpacity
              key={shop._id}
              style={styles.shopCard}
              activeOpacity={0.50}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: shop.ShopPhoto }}
                  style={styles.shopImage}
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.shopName}>{shop.ShopName}</Text>
                  <View style={styles.locationBadge}>
                    <Icon name="map-pin" size={12} color="#fff" />
                    <Text style={styles.locationText}>{shop.place}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.shopInfo}>
                <View style={styles.infoSection}>
                  <View style={styles.infoRow}>
                    <Icon name="phone" size={16} color="#fff" />
                    <Text style={styles.infoText}>{shop.Tel}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Icon name="globe" size={16} color="#fff" />
                    <Text style={styles.infoText}>{shop.website}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View>
                  <Text style={styles.brandsLabel}>Available brands</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.brandsScroll}
                    contentContainerStyle={styles.brandsScrollContent}
                  >
                    {shop.brands && shop.brands.map((brand, index) => (
                      <View key={index} style={styles.brandContainer}>
                        <Image
                          source={{ uri: brand.images }}
                          style={styles.brandLogo}
                        />
                        <Text style={styles.brandName}>{brand.name}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => openModal(shop)}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Icon name="chevron-right" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noShopsContainer}>
            <Icon name="shopping-bag" size={50} color="#666" />
            <Text style={styles.noShopsText}>No shops available</Text>
          </View>
        )}
      </ScrollView>

      {/* ShopCard will now open correctly even after navigation */}
      <ShopCard
        visible={modalVisible}
        onRequestClose={closeModal}
        shop={selectedShop}
      />

      <TouchableOpacity
        style={styles.matchesButton}
        onPress={toggleMatches}
        activeOpacity={0.7}
      >
        <LottieView
          source={require('../../assets/lottie/calendar.json')}
          autoPlay
          loop
          style={{ width: 40, height: 40 }}
          colorFilters={[
            {
              keypath: "**", 
              color: "#FFFFFF" 
            }
          ]}
        />
      </TouchableOpacity>

      {/* Matches component that shows when button is clicked */}
      {showMatches && <Matches visible={showMatches} onClose={toggleMatches} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    marginTop: 25,
    letterSpacing: 0.5,
  },
  shopsList: {
    flex: 1,
  },
  shopCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  shopImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.5)', // Use solid color with opacity instead of gradient
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  shopInfo: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    color: '#bbb',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
  },
  brandsLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    fontWeight: '600',
  },
  brandsScroll: {
    marginBottom: 16,
  },
  brandsScrollContent: {
    paddingRight: 16,
  },
  brandContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  brandLogo: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  brandName: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 70,
  },
  viewDetailsButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 6,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noShopsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noShopsText: {
    color: '#888',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  matchesButton: {
    position: 'absolute',
    bottom: 75, // Increased to position above the tab bar
    right: 10,
    backgroundColor: 'white',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
});

export default Shop;