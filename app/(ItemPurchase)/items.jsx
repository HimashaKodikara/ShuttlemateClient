import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import icons from '../../constants/icons';
import {router} from 'expo-router';

const Items = () => {
  
  const products = [
    {
      id: 1,
      name: 'Yonex Nanoflare 10002',
      price: 15000,
      category: 'Rackets',
     // image: require('../assets/nanoflare.png'), // You'll need to add your own images
    },
    {
      id: 2,
      name: 'Li-Ning Astrox S9',
      price: 25000,
      category: 'Rackets',
      //image: require('../assets/astrox.png'),
    },
    {
      id: 3,
      name: 'Yonex PC Gladiator',
      price: 23500,
      category: 'Shoes',
      //image: require('../assets/gladiator.png'),
    },
    {
      id: 4,
      name: 'Yonex AC Kit Bag',
      price: 5900,
      category: 'Bags',
      //image: require('../assets/bag.png'),
    },
    {
      id: 5,
      name: 'YANT Men\'s Resist',
      price: 8250,
      category: 'Shoes',
      //image: require('../assets/resist.png'),
    },
    {
      id: 6,
      name: 'Long Lasting Microfiber Grip',
      price: 250,
      category: 'Accessories',
      //image: require('../assets/grip.png'),
    },
  ];

  const categories = ['All', 'Rackets', 'Shoes', 'Bags', 'Accessories'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleBackPress = () => {
  router.push('/shop'); // Navigate to the shop page
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Image
            source={icons.back}
            style={styles.backIcon}
            resizeMode="contain"
          />
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
              onPress={() => setSelectedCategory(category)}
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
      
      <ScrollView contentContainerStyle={styles.productsGrid}>
        {filteredProducts.map(product => (
          <TouchableOpacity key={product.id} style={styles.productCard}>
            <View style={styles.imageContainer}>
              {product.image ? (
                <Image
                  source={product.image}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.productPrice}>₹{product.price.toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    marginTop:15,
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
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal:'auto'
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
    backgroundColor: 'black',
    borderRadius: 8,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
  productPrice: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default Items;