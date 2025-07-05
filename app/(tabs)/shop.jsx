import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView, RefreshControl, ImageBackground } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import ItemCard from '../components/ItemCard'
import ShopCard from '../components/ShopCard'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import API_BASE_URL from '../../server/api.config'
import bg from '../../assets/backgorundimg.jpg'


const Shop = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // New states for shop selection
  const [shops, setShops] = useState([])
  const [selectedShopId, setSelectedShopId] = useState('')
  const [selectedShopName, setSelectedShopName] = useState('Shop at the designated store')
  const [isShopModalVisible, setIsShopModalVisible] = useState(false)
  const [selectedShop, setSelectedShop] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Function to check if item is available
  const isItemAvailable = (availableQty) => {
    return availableQty && availableQty > 0;
  }

  const onRefresh = async () => {
    setRefreshing(true)
    // Refresh data
    await fetchShops()
    await fetchItems()
    setSelectedShopId('')
    setSelectedShopName('Select a Shop')
    setSelectedShop(null)
    setIsDropdownOpen(false)
    setRefreshing(false)
  }

  useEffect(() => {
    fetchShops()
    fetchItems()
  }, [])

  const fetchShops = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shops/`)

      if (response.data && response.data.shops && Array.isArray(response.data.shops)) {
        setShops(response.data.shops)
      } else if (Array.isArray(response.data)) {
        setShops(response.data)
      } else {
        console.error('Unexpected API response format:', response.data)
        setShops([])
      }
    } catch (err) {
      console.error('Error fetching shops:', err)
      setShops([])
    }
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/items/`)

      if (response.data && Array.isArray(response.data)) {
        const allItems = response.data.reduce((acc, category) => {
          if (category.items && Array.isArray(category.items)) {
            return [...acc, ...category.items]
          }
          return acc
        }, [])

        setItems(allItems)
      } else {
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
      setIsShopModalVisible(false)
      setIsDropdownOpen(false)

      return () => {
        // Cleanup if needed
      }
    }, [])
  )

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleShopSelection = async (shop) => {
    setSelectedShopId(shop._id)
    setSelectedShopName(shop.ShopName)
    setIsDropdownOpen(false)

    try {
      // Check if shop already has all the needed details to avoid extra API call
      if (shop.brands && shop.categories && shop.items) {
        setSelectedShop(shop)
        setIsShopModalVisible(true)
      } else {

        const response = await axios.get(`${API_BASE_URL}/shops/shop/${shop._id}`)

        const shopData = response.data && response.data.shop ? response.data.shop : response.data
        setSelectedShop(shopData)
        setIsShopModalVisible(true)
      }
    } catch (err) {
      console.error('Error fetching shop details:', err)
    }
  }


  const getColorCode = (colorName) => {
    const colorMap = {

      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#808080',
      'grey': '#808080',
      'silver': '#C0C0C0',
      'gold': '#FFD700',

      // Additional colors
      'beige': '#F5F5DC',
      'navy': '#000080',
      'teal': '#008080',
      'maroon': '#800000',
      'olive': '#808000',
      'aqua': '#00FFFF',
      'lime': '#00FF00',
      'coral': '#FF7F50',
      'magenta': '#FF00FF',
      'cyan': '#00FFFF',
      'violet': '#EE82EE',
      'indigo': '#4B0082',
      'turquoise': '#40E0D0',
      'crimson': '#DC143C',
      'lavender': '#E6E6FA',
      'tan': '#D2B48C',
      'salmon': '#FA8072',
      'khaki': '#F0E68C',
    }

    // Check if color name exists in our map (case insensitive)
    const lowerCaseColorName = colorName ? colorName.toLowerCase() : '';

    // Try exact match first
    if (colorMap[lowerCaseColorName]) {
      return colorMap[lowerCaseColorName];
    }

    // Try partial match
    for (const [key, value] of Object.entries(colorMap)) {
      if (lowerCaseColorName.includes(key)) {
        return value;
      }
    }


    return '#CCCCCC';
  }

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
        {item.color && (
          <View style={styles.colorContainer}>
            <View
              style={[
                styles.colorDot,
                { backgroundColor: getColorCode(item.color) }
              ]}
            />
          </View>
        )}
        <View style={styles.availabilityContainer}>
          <Text style={[
            styles.availabilityText,
            isItemAvailable(item.availableqty) ? styles.availableText : styles.unavailableText
          ]}>
            {isItemAvailable(item.availableqty) ? 'Available' : 'Out of Stock'}
          </Text>
          {isItemAvailable(item.availableqty) && (
            <Text style={styles.quantityText}>
              ({item.availableqty} left)
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  const handleItemPress = (item) => {
    setSelectedItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      color: item.color,
      image: item.itemphoto,
      brand: item.brand,
      features: item.features,
      availableqty: item.availableqty,
      shopName: item.shopName
    })
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
    setSelectedItem(null)
  }

  const closeShopModal = () => {
    setIsShopModalVisible(false)
    setSelectedShop(null)
  }

  if (loading) {
    return (
      <ImageBackground
        source={bg}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4A90E2" />
          
        </View>
      </ImageBackground>
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
    <ImageBackground
      source={bg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Shop Now</Text>

          {/* Custom Dropdown for Shop Selection */}
          <View style={styles.dropdownContainer}>

            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={toggleDropdown}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>{selectedShopName}</Text>
              <Icon name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                  {Array.isArray(shops) && shops.length > 0 ? (
                    shops.map((shop) => {
                      // Check if shop data is valid
                      if (!shop || !shop._id || !shop.ShopName) {
                        return null
                      }

                      return (
                        <TouchableOpacity
                          key={shop._id}
                          style={styles.dropdownItem}
                          onPress={() => handleShopSelection(shop)}
                        >
                          <Image
                            source={{ uri: shop.ShopPhoto || 'https://via.placeholder.com/30' }}
                            style={styles.shopIcon}
                            resizeMode="cover"
                          />
                          <Text style={styles.dropdownItemText}>{shop.ShopName}</Text>
                        </TouchableOpacity>
                      )
                    })
                  ) : (
                    <View style={styles.emptyShopsList}>
                      <Text style={styles.emptyShopsText}>No shops available</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4A90E2']}
              />
            }
            ListEmptyComponent={
              <View style={styles.centered}>
                <Text style={{ color: '#fff' }}>No items found</Text>
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

          {/* Shop Detail Modal */}
          {selectedShop && (
            <ShopCard
              visible={isShopModalVisible}
              onRequestClose={closeShopModal}
              shop={selectedShop}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({

  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 26, 0.98)',
  },
  header: {
    color: 'white',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 30,
    padding: 5,
    textAlign: 'center'
  },
  dropdownContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
    zIndex: 10,
    position: 'relative',
    marginTop: 10
  },
  dropdownLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  dropdownSelector: {
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownList: {
    position: 'absolute',
    top: 85, // Positioned below the selector
    left: 5,
    right: 5,
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    maxHeight: 500,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    zIndex: 20,
    elevation: 5,
  },
  dropdownScroll: {
    maxHeight: 500,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  shopIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  emptyShopsList: {
    padding: 15,
    alignItems: 'center',
  },
  emptyShopsText: {
    color: '#aaa',
    fontSize: 14,
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
    opacity: 0.9

  },
  itemDetails: {
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#fff'
  },
  // New color container style for the dot and text
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  // Color dot style
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  itemColor: {
    fontSize: 14,
    color: '#fff',
  },
  // New availability styles
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  availableText: {
    color: '#4CAF50', // Green for available
  },
  unavailableText: {
    color: '#F44336', // Red for out of stock
  },
  quantityText: {
    fontSize: 12,
    color: '#aaa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0A0A1A'
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
})

export default Shop