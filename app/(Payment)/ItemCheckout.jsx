import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import API_BASE_URL from '../../server/api.config';

const ItemCheckout = () => {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Debug function to log to console and potentially show alert for critical issues
  const logDebug = (message, data, showAlert = false) => {

    if (showAlert) {
      Alert.alert('Debug Info', `${message}: ${JSON.stringify(data)}`);
    }
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        logDebug('Local search params', params);
        
        const itemId = params?.itemId || 
                      (typeof params === 'string' ? params : null) ||
                      (params?.params?.itemId);
                      
        logDebug('Extracted itemId', itemId);
        
        if (!itemId) {
          throw new Error('No item ID provided');
        }

        const url = `${API_BASE_URL}/items/${params.itemId}`;
        logDebug('Fetching item from API', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch item: ${response.status} ${errorText}`);
        }

        const itemData = await response.json();
        logDebug('Fetched item from API', itemData);

        // Transform the item data to our desired format
        const processedItem = {
          id: itemData._id,
          name: itemData.name || 'Unknown Item',
          description: itemData.features || '',
          price: parseInt(itemData.price) || 0,
          image: itemData.itemphoto || null,
          brand: itemData.brand || '',
          color: itemData.color || '',
          shopId: itemData.shopId || 'unknown',
          shopName: itemData.shopName || 'Unknown Shop',
          availableQuantity: parseInt(itemData.availableqty) || 0
        };

        setItem(processedItem);
        setLoading(false);
      } catch (err) {
        logDebug('Error fetching item details', err.message, true);
        setError(err.message || 'Failed to load item details');
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [params.itemId]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (item && newQuantity > item.availableQuantity) {
      setQuantity(item.availableQuantity);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleCheckout = () => {
    // Pass the selected item and quantity to payment screen
    router.push({
      pathname: '/(Payment)/PaymentAdress',
      params: { 
        itemId: item.id,
        quantity: quantity,
        total: item.price * quantity
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1F3B8B" />
        <Text style={styles.loaderText}>Loading item details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Back to Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
        <Text style={styles.emptyText}>Item not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const maxQuantityReached = quantity >= item.availableQuantity;
  const totalAmount = item.price * quantity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonHeader} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            {item.image ? (
              <Image 
                source={{ uri: item.image }} 
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}
          </View>

          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            {item.brand && <Text style={styles.itemBrand}>by {item.brand}</Text>}
       

            {item.color && (
              <View style={styles.colorContainer}>
                <View style={[styles.colorDot, { backgroundColor: item.color.toLowerCase() }]} />
                <Text style={styles.itemSpecs}>{item.color}</Text>
              </View>
            )}

            <View style={styles.shopContainer}>
              <Ionicons name="storefront-outline" size={18} color="#777" style={styles.shopIcon} />
              <Text style={styles.shopName}>{item.shopName}</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price:</Text>
              <Text style={styles.priceValue}>Rs. {item.price.toLocaleString()}</Text>
            </View>

            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                  onPress={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Text style={[styles.quantityButtonText, quantity <= 1 && styles.quantityButtonTextDisabled]}>-</Text>
                </TouchableOpacity>
                <View style={styles.quantityTextContainer}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.quantityButton, maxQuantityReached && styles.quantityButtonDisabled]}
                  onPress={() => handleQuantityChange(quantity + 1)}
                  disabled={maxQuantityReached}
                >
                  <Text style={[styles.quantityButtonText, maxQuantityReached && styles.quantityButtonTextDisabled]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {maxQuantityReached && (
              <Text style={styles.maxQuantityText}>
                Maximum available quantity: {item.availableQuantity}
              </Text>
            )}

            <View style={styles.availabilityContainer}>
              <Ionicons 
                name={item.availableQuantity > 0 ? "checkmark-circle" : "close-circle"} 
                size={18} 
                color={item.availableQuantity > 0 ? "#4caf50" : "#f44336"} 
              />
              <Text style={[
                styles.availabilityText, 
                {color: item.availableQuantity > 0 ? "#4caf50" : "#f44336"}
              ]}>
                {item.availableQuantity > 0 ? "In Stock" : "Out of Stock"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Item Price:</Text>
          <Text style={styles.summaryValue}>Rs. {item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Quantity:</Text>
          <Text style={styles.summaryValue}>x {quantity}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>Rs. {totalAmount.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={() => router.back()}>
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.addToCartButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.checkoutButton, (!item || item.availableQuantity === 0) && styles.checkoutButtonDisabled]}
          disabled={!item || item.availableQuantity === 0}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Payment</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop:20,
    backgroundColor:'#0A0A1A'
  },
  backButtonHeader: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color:'white'
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1F3B8B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#1F3B8B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  itemContainer: {
    backgroundColor: '#0A0A1A',
    borderRadius: 8,
    overflow: 'hidden',
    margin: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  itemBrand: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
 
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  itemSpecs: {
    fontSize: 14,
    color: '#fff',
  },
  shopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
    marginBottom: 8,
  },
  shopIcon: {
    marginRight: 6,
  },
  shopName: {
    fontSize: 14,
    color: '#fff',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#fff',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#fff',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  quantityButtonDisabled: {
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  quantityTextContainer: {
    width: 40,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  quantityText: {
    fontSize: 16,
    color:'#fff'
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#fff'
  },
  quantityButtonTextDisabled: {
    color: '#ccc',
  },
  maxQuantityText: {
    fontSize: 13,
    color: '#f44336',
    marginBottom: 12,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  availabilityText: {
    fontSize: 14,
    marginLeft: 6,
  },
  summaryContainer: {
    backgroundColor: '#0A0A1A',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#fff',
  },
  summaryValue: {
    fontSize: 14,
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#0A0A1A',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  checkoutButton: {
    flex: 2,
    height: 48,
    flexDirection: 'row',
    backgroundColor: '#1F3B8B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#ccc',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
});

export default ItemCheckout;