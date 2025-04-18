import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ItemCard = ({ item, onClose }) => {
  // Destructure item properties or use defaults
  const { name, price, color, image } = item || {};

  return (
    <View style={styles.modalContainer}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image || 'https://placeholder.com/product' }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{name || 'YONEX-Sac de raquette'}</Text>
          <Text style={styles.price}>RS {parseInt(price || 15000).toLocaleString()}</Text>
          <Text style={styles.color}>{color || 'Blue'}</Text>
          
          <TouchableOpacity style={styles.buyButton} onPress={() => console.log('Buy Now pressed')}>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  card: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
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
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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