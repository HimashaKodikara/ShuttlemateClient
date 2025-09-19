// ShopCard.js - Fixed component
import React from 'react';
import { View, Text, Image, Modal, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';


const ShopCard = ({ visible, onRequestClose, shop }) => {
   


    const handlePhoneCall = () => {
        const phoneNumber = shop?.Tel;
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleOpenWebsite = () => {
        const website = shop?.website || 'http://www.eliteshuttler.com';
        Linking.openURL(website);
    };

    const handleShopNow = () => {
        
        router.push({
          pathname: '/items',
          params: { shopId: shop._id }, 
        });
      };
      
      
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onRequestClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.card}>
                    <TouchableOpacity onPress={onRequestClose} style={styles.closeButtonContainer}>
                        <Text style={styles.closeButton}>✕</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Image
                            source={{ uri: shop?.ShopPhoto || 'https://via.placeholder.com/350x150' }}
                            style={styles.headerImage}
                            resizeMode="cover"
                        />
                        <View style={styles.imageoverly}>
                            <Text style={styles.headerTitle}>{shop?.ShopName || 'ELITESHUTTLER'}</Text>
                        </View>
                    </View>

                    {/* Contact Info */}
                    <View style={styles.contactInfo}>
                        <View style={styles.contactRow}>
                            <Icon name="map-pin" style={styles.iconPlaceholder} size={12} color="black" />
                            <Text style={styles.contactText}>{shop?.place || 'Sri Lanka'}</Text>
                        </View>
                        <TouchableOpacity style={styles.contactRow} onPress={handlePhoneCall}>
                            <LottieView
                                source={require('../../assets/lottie/phone.json')} 
                                autoPlay
                                loop
                                style={styles.iconPlaceholder}
                            />
                            <Text style={styles.contactText}>{shop?.Tel || 'Tel'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactRow} onPress={handleOpenWebsite}>
                            <LottieView
                                source={require('../../assets/lottie/web.json')} 
                                autoPlay
                                loop
                                
                                style={styles.iconPlaceholder}
                            />
                            <Text style={styles.contactText}>{shop?.website || 'No website'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Equipment Price Table */}
                    <View style={styles.tableContainer}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>Equipment</Text>
                            <Text style={styles.tableHeaderText}>Price Range(Rs)</Text>
                        </View>
                        {shop?.categories && shop.categories.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{item.categoryName}</Text>
                                <Text style={styles.tableCell}>{item.priceRange}</Text>
                            </View>
                        ))}

                    </View>

                    {/* Available Brands */}
                    <View style={styles.brandsSection}>
                        <Text style={styles.brandsTitle}>Available brands</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.brandsScroll}
                            contentContainerStyle={styles.brandsScrollContent}
                        >
                            {shop?.brands && shop.brands.map((brand, index) => (
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
                        style={styles.shopButton}
                        onPress={handleShopNow}
                    >
                        <Text style={styles.shopButtonText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    card: {
        width: 350,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white',
        padding:1
    },
    closeButton: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        position: 'relative',
        height: 150,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    imageoverly: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    headerTitle: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    contactInfo: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    iconPlaceholder: {
        width: 16,
        height: 16,
        marginRight: 8,
        borderRadius: 8,
    },
    contactText: {
        fontSize: 12,
        color: '#333',
    },
    tableContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    tableCell: {
        fontSize: 12,
        color: '#333',
    },
    brandsSection: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    brandsTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    brandsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    brandBox: {
        width: 48,
        height: 24,
        borderRadius: 2,
    },
    shopButton: {
        backgroundColor: '#1a237e',
        padding: 12,
        alignItems: 'center',
        margin: 12,
        borderRadius: 4,
    },
    shopButtonText: {
        color: 'white',
        fontWeight: 'bold',
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
    brandContainer: {
        alignItems: 'center',
        marginRight: 16,
    },
    brandName: {
        fontSize: 10,
        marginTop: 4,
        color: '#666',
    },
    brandsScroll: {
        marginTop: 8,
    },
    brandsScrollContent: {
        paddingRight: 8,
    },
});

export default ShopCard;