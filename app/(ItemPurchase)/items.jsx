import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Modal, RefreshControl } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import icons from '../../constants/icons';
import axios from 'axios';
import API_BASE_URL from '../../server/api.config';
import ItemCard from '../components/ItemCard';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const Items = () => {
  const { shopId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Add state for the ItemCard modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Function to load shop data
  const loadShopData = async () => {
    try {
      setLoading(true);
      
      // If we have a shopId, fetch items by shop ID
      if (shopId) {
        // Fetch items categorized by shop ID
        const itemsResponse = await axios.get(`${API_BASE_URL}/items/shop/${shopId}`);
        const categorizedItems = itemsResponse.data;
        
        // Extract categories
        const categoryList = ['All'];
        categorizedItems.forEach(category => {
          categoryList.push(category.categoryName);
        });
        
        setCategories(categoryList);
        
        // Flatten items for initial display
        const allItems = [];
        categorizedItems.forEach(category => {
          category.items.forEach(item => {
            allItems.push({
              id: item._id,
              name: item.name,
              price: item.price,
              color: item.color,
              image: item.itemphoto,
              category: category.categoryName,
              categoryId: category.categoryId
            });
          });
        });
        
        setProducts(allItems);
        setFilteredProducts(allItems);
        
      } else {
        // If no specific shop, fetch all items
        const response = await axios.get(`${API_BASE_URL}/items`);
        const categorizedItems = response.data;
        
        // Extract categories
        const categoryList = ['All'];
        categorizedItems.forEach(category => {
          categoryList.push(category.categoryName);
        });
        
        setCategories(categoryList);
        
        // Flatten items for initial display
        const allItems = [];
        categorizedItems.forEach(category => {
          category.items.forEach(item => {
            allItems.push({
              id: item._id,
              name: item.name,
              price: item.price,
              color: item.color,
              image: item.itemphoto,
              category: category.categoryName,
              categoryId: category.categoryId,
              shopId: item.shopId,
              shopName: item.shopName
            });
          });
        });
        
        setProducts(allItems);
        setFilteredProducts(allItems);
      }
    } catch (err) {
      console.error('Error fetching shop data:', err);
      setError('Failed to load shop data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch shop data and categories when component mounts
  useEffect(() => {
    loadShopData();
  }, [shopId]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setError(null);
    loadShopData();
  }, [shopId]);

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === selectedCategory);
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    
    if (category !== 'All' && shopId) {
      try {
        setLoading(true);
        // Find the category ID from our products list
        const categoryItem = products.find(item => item.category === category);
        if (categoryItem && categoryItem.categoryId) {
          const response = await axios.get(`${API_BASE_URL}/items/category/${categoryItem.categoryId}`);
          const categoryItems = response.data.map(item => ({
            id: item._id,
            name: item.name,
            price: item.price,
            color: item.color,
            image: item.itemphoto,
            category: category
          }));
          setFilteredProducts(categoryItems);
        } else {
          // If we can't find the category ID, fall back to client-side filtering
          const filtered = products.filter(product => product.category === category);
          setFilteredProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching category items:', err);
        // Fall back to client-side filtering on error
        const filtered = products.filter(product => product.category === category);
        setFilteredProducts(filtered);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackPress = () => {
    router.push('/shop');
  };

  // Function to handle product selection and show the modal
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
      setSelectedProduct(null);
      
      return () => {
        // Cleanup function
      };
    }, [])
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#5e72e4" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.retryButton, {marginTop: 10}]} onPress={() => router.push('/shop')}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
                   <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Now</Text>
      </View>
      
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products available in this category</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.productsGrid}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#5e72e4"
              colors={["black"]}
              progressBackgroundColor="white"
            />
          }
        >
          {filteredProducts.map(product => (
            <TouchableOpacity 
              key={product.id} 
              style={styles.productCard}
              onPress={() => handleProductSelect(product)}
            >
              <View style={styles.imageContainer}>
                {product.image ? (
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
              </View>
              <View style={styles.productInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  {product.color && (
                    <View style={styles.colorContainer}>
                      <View style={[styles.colorDot, { backgroundColor: product.color }]} />
                    </View>
                  )}
                </View>
                <Text style={styles.productPrice}>Rs. {parseInt(product.price).toLocaleString()}</Text>
                
                {!shopId && product.shopName && (
                  <Text style={styles.shopName}>{product.shopName}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        {selectedProduct && (
          <ItemCard item={selectedProduct} onClose={handleCloseModal} />
        )}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    marginTop: 15,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  categoriesContainer: {
    marginVertical: 10,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'white',
  },
  selectedCategory: {
    backgroundColor: '#5e72e4',
  },
  categoryText: {
    color: 'black',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 30, // Add extra padding at the bottom for pull to refresh
    minHeight: '100%', // Ensure scroll view is always scrollable for refresh to work
  },
  productCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  imageContainer: {
    height: 150,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '90%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  productPrice: {
    color: 'black',
    fontSize: 14,
    fontWeight:'400',
    marginTop: 4,
  },
  shopName: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  retryButton: {
    backgroundColor: '#5e72e4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default Items;