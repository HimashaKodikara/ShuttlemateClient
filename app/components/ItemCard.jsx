import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo-vector-icons
import shop from '../../assets/icons/shop.png'
const ItemCard = ({ item, onClose }) => {
  const { 
    name, 
    price, 
    color, 
    image, 
    shopName, 
    brand, 
    features,
    availableqty
  } = item || {};
  
  // Convert features string to array if it exists
  const featuresList = features ? features.split(',').map(feature => feature.trim()) : [];

  return (
    <View style={styles.modalContainer}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          {/* Close button positioned at top right */}
          <TouchableOpacity 
            style={styles.closeIconButton} 
            onPress={onClose}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Ionicons name="close-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: image || 'https://via.placeholder.com/400' }} 
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.infoContainer}>
            {/* Product name and brand */}
            <View style={styles.headingRow}>
              <Text style={styles.title}>{name || 'Product Name'}</Text>
              {brand && <Text style={styles.brand}>by {brand}</Text>}
            </View>
            {/* Shop name with icon */}
            {shopName && (
              <View style={styles.shopRow}>
                 <Image 
              source={shop} 
              style={styles.shopimage}
              resizeMode="contain"
            />
                
                <Text style={styles.shopName}>{shopName}</Text>
              </View>
            )}
            {/* Price and availability in same row */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>Rs. {parseInt(price || 15000).toLocaleString()}</Text>
              {availableqty && (
                <View style={[
                  styles.availabilityBadge, 
                  parseInt(availableqty) > 0 ? styles.inStock : styles.outOfStock
                ]}>
                  <Text style={styles.availabilityText}>
                    {parseInt(availableqty) > 0 
                      ? `${availableqty} in stock` 
                      : 'Out of stock'}
                  </Text>
                </View>
              )}
            </View>
            
            
            
            {/* Color with visual indicator */}
            {color && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Color:</Text>
                <View style={styles.colorSection}>
                  <View 
                    style={[
                      styles.colorDot, 
                      { backgroundColor: color.toLowerCase() }
                    ]} 
                  />
                  <Text style={styles.detailValue}>{color}</Text>
                </View>
              </View>
            )}
            
            {/* Features list */}
            {featuresList.length > 0 && (
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresTitle}>Key Features</Text>
                {featuresList.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* Call-to-action buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.cartButton}
                onPress={onClose}
              >
               
                <Text style={styles.cartButtonText}>Close</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.buyButton} 
                onPress={() => router.push('/(Payment)/PaymentAdress')}
              >
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  scrollContainer: {
    width: '95%',
    maxHeight: '95%',
  },
  shopimage:{
  height:"16",
  width:16
},

  card: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: '#0F0F1A',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 20,
    marginHorizontal: 'auto',
    position: 'relative',
  },
  closeIconButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    opacity: 1
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 18,
  },
  headingRow: {
    marginBottom: 15,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  brand: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: '400',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  price: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  inStock: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  outOfStock: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  availabilityText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shopName: {
    color: '#AAA',
    fontSize: 14,
    marginLeft: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    color: '#AAA',
    fontSize: 14,
    width: 80,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  colorSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  featuresContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  featuresTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    color: '#DDD',
    fontSize: 14,
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cartButton: {
    backgroundColor: '#333344',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
  buyButton: {
    backgroundColor: '#1F3B8B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ItemCard;