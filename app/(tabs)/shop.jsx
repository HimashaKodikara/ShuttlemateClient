import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect,useCallback } from 'react'
import axios from 'axios'
import ItemCard from '../components/ItemCard' // Import the ItemCard component
import { useFocusEffect } from '@react-navigation/native';

const Shop = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://192.168.1.10:5000/api/items/')
      
      // Process the categorized response to get a flat list of all items
      if (response.data && Array.isArray(response.data)) {
        // Extract all items from all categories and flatten into a single array
        const allItems = response.data.reduce((acc, category) => {
          if (category.items && Array.isArray(category.items)) {
            return [...acc, ...category.items]
          }
          return acc
        }, [])
        
        setItems(allItems)
      } else {
        // If response is already a flat array, use it directly
        setItems(response.data)
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching items:', err)
      setError('Failed to fetch items')
      setLoading(false)
    }
  }

   useFocusEffect(
      useCallback(() => {
       
        setIsModalVisible(false)
       setSelectedItem(null)
        
        return () => {
      
        };
      }, [])
    );
  

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemCard} 
      onPress={() => handleItemPress(item)}
    >
      <Image 
        source={{ uri: item.itemphoto }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Rs.{item.price.toLocaleString()}</Text>
        {item.color && <Text style={styles.itemColor}>{item.color}</Text>}
        
      </View>
    </TouchableOpacity>
  )

  const handleItemPress = (item) => {
 
    setSelectedItem({
      name: item.name,
      price: item.price,
      color: item.color,
      image: item.itemphoto 
    })
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setSelectedItem(null)
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading items...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchItems}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shop Now</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No items found</Text>
          </View>
        }
      />
      

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <ItemCard item={selectedItem} onClose={closeModal} />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#0A0A1A',
    paddingBottom:10
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    marginTop:30
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemCard: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#1A1A2E',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 120,
  },
  itemDetails: {
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color:'#fff'
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c6e49',
    marginBottom: 4,
  },
  itemColor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  shopName: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4a80f5',
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontWeight: '500',
  }
});

export default Shop