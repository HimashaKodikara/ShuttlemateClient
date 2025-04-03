import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

const Shop = () => {
  const shops = [
    {
      id: 1,
      name: 'ELITESHUTTLER',
      location: 'Dehradun',
      phone: '+91 70 555 4555',
      priceRange: '5000 - 100,000',
     // image: require('../assets/eliteshuttler.png'),
      brands: ['Yonex', 'Victor', 'Li-Ning', 'Apacs'],
      brandLogos: [
        // require('../assets/brands/yonex.png'),
        // require('../assets/brands/victor.png'),
        // require('../assets/brands/lining.png'),
        // require('../assets/brands/apacs.png'),
      ]
    },
    {
      id: 2,
      name: 'WINNERS SPORTS',
      location: 'Bannerghatta',
      phone: '+91 76 567 9555',
      priceRange: '2000 - 45,000',
      //image: require('../assets/winners-sports.png'),
      brands: ['Yonex', 'Victor', 'Li-Ning'],
      brandLogos: [
        // require('../assets/brands/yonex.png'),
        // require('../assets/brands/victor.png'),
        // require('../assets/brands/lining.png'),
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shops</Text>
      
      <ScrollView style={styles.shopsList}>
        {shops.map((shop) => (
          <TouchableOpacity key={shop.id} style={styles.shopCard}>
            <Image source={shop.image} style={styles.shopImage} />
            
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{shop.name}</Text>
              
              <View style={styles.infoRow}>
                <Icon name="map-pin" size={16} color="#666" />
                <Text style={styles.infoText}>{shop.location}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Icon name="phone" size={16} color="#666" />
                <Text style={styles.infoText}>{shop.phone}</Text>
              </View>
              
              <Text style={styles.priceLabel}>Price Range (₹):</Text>
              <Text style={styles.priceRange}>{shop.priceRange}</Text>
              
              <Text style={styles.brandsLabel}>Available brands:</Text>
              <View style={styles.brandLogos}>
                {shop.brandLogos.map((logo, index) => (
                  <Image key={index} source={logo} style={styles.brandLogo} />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  shopsList: {
    flex: 1,
  },
  shopCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  shopImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  shopInfo: {
    padding: 16,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  priceRange: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  brandsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  brandLogos: {
    flexDirection: 'row',
    gap: 8,
  },
  brandLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  }
});

export default Shop;