import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router'; // Assuming you're using expo-router for navigation

const ItemCard = ({ item, onClose }) => {
  const { name, price, color, image, shopName } = item || {};

  return (
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image || 'https://via.placeholder.com/400' }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{name || 'No name'}</Text>
          <Text style={styles.price}>RS {parseInt(price || 15000).toLocaleString()}</Text>
          <Text style={styles.color}>Color: {color || 'Blue'}</Text>
          {shopName && <Text style={styles.shopName}>{shopName}</Text>}
          
          <TouchableOpacity style={styles.buyButton} onPress={() => router.push('/(Payment)/PaymentAdress')}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shopName: {
    color: '#888',
    fontSize: 12,
    marginBottom: 10,
    opacity: 0.8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: '#0F0F1A',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: '200%', // Keeping original width as in your code
    height: '100%',
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  color: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 15,
    opacity: 0.7,
  },
  buyButton: {
    backgroundColor: '#1F3B8B',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ItemCard;