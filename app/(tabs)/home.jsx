import React from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native-web';
import images from '../../constants/images';
import SearchInput from '../components/SearchInput';
import Trending from '../components/Trending';
import EmptyState from '../components/EmptyState';
const Home = () => {
  return (
    // <SafeAreaView style={styles.container}>'
    //     <ScrollView style={styles.scrollView}>'
    //   {/* Header */}
    //   <View style={styles.header}>
    //     <Text style={styles.welcomeText}>Welcome Back</Text>
    //     <Text style={styles.titleText}>ShuttleMate</Text>
    //   </View>

    //   {/* Search Bar */}
    //   <View style={styles.searchBar}>
    //     <TextInput 
    //       style={styles.searchInput}
    //       placeholder="Search for a video topic"
    //       placeholderTextColor="#777"
    //     />
    //     <TouchableOpacity style={styles.searchButton}>
    //       <Feather name="search" size={20} color="#fff" />
    //     </TouchableOpacity>
    //   </View>

    //   {/* Video Grid */}

    //     {/* Featured Videos Row */}
    //     <View style={styles.featuredRow}>
    //       <View style={styles.featuredCard}>
    //         <Image 
    //           source={{ uri: 'https://via.placeholder.com/120/FF4040' }}
    //           style={styles.featuredImage}
    //           resizeMode="cover"
    //         />
    //       </View>
    //       <View style={styles.featuredCard}>
    //         <Image 
    //           source={{ uri: 'https://via.placeholder.com/120/FF4040' }}
    //           style={styles.featuredImage}
    //           resizeMode="cover"
    //         />
    //       </View>
    //       <View style={styles.featuredCard}>
    //         <Image 
    //           source={{ uri: 'https://via.placeholder.com/120/FF4040' }}
    //           style={styles.featuredImage}
    //           resizeMode="cover"
    //         />
    //       </View>
    //     </View>

    //     {/* Video Cards */}
    //     <View style={styles.videoCard}>
    //       <View style={styles.cardContent}>
    //         <Image 
    //           source={{ uri: 'https://via.placeholder.com/180/FF4040' }}
    //           style={styles.cardImage}
    //           resizeMode="cover"
    //         />

    //       </View>
    //       <View style={styles.cardDetails}>
    //         <View style={styles.videoInfo}>
    //           <Image 
    //             source={{ uri: 'https://via.placeholder.com/40' }}
    //             style={styles.avatarImage}
    //           />
    //           <View style={styles.videoTextContainer}>
    //             <Text style={styles.videoTitle}>Backhand Net Shot</Text>
    //             <Text style={styles.channelName}>Chris Yun</Text>
    //           </View>
    //         </View>
    //         <TouchableOpacity>
    //           <MaterialIcons name="more-vert" size={24} color="#777" />
    //         </TouchableOpacity>
    //       </View>
    //     </View>

    //     <View style={styles.videoCard}>
    //       <View style={styles.cardContent}>
    //         <Image 
    //           source={{ uri: 'https://via.placeholder.com/180/FF4040' }}
    //           style={styles.cardImage}
    //           resizeMode="cover"
    //         />
    //       </View>
    //       <View style={styles.cardDetails}>
    //         <View style={styles.videoInfo}>
    //           <Image 
    //             source={{ uri: 'https://via.placeholder.com/40' }}
    //             style={styles.avatarImage}
    //           />
    //           <View style={styles.videoTextContainer}>
    //             <Text style={styles.videoTitle}>Backhand Service</Text>
    //             <Text style={styles.channelName}>Chris Yun</Text>
    //           </View>
    //         </View>
    //         <TouchableOpacity>
    //           <MaterialIcons name="more-vert" size={24} color="#777" />
    //         </TouchableOpacity>
    //       </View>
    //     </View>

    //     <View style={styles.videoCard}>
    //       <View style={styles.cardContent}>
    //         <Image 
    //           source={{ uri: 'https://via.placeholder.com/180/FF4040' }}
    //           style={styles.cardImage}
    //           resizeMode="cover"
    //         />
    //         <View style={styles.playButtonContainer}>
    //           <View style={styles.playButton}>
    //             <Feather name="play" size={24} color="#fff" />
    //           </View>
    //         </View>
    //       </View>
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
    <SafeAreaView style={styles.container}>
      <FlatList
       // data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
        data={[]}
        
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Text style={styles.list}>{item.id}</Text>
        )}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.header}>
              <View >
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.titleText}>ShuttleMate</Text>
              </View>
              <View>
                <Image
                  source={images.Logo}
                  resizeMethod='resize'
                  style={{ width: 50, height: 50 }}
                />

              </View>

            </View>
            <SearchInput />

            <View>
              <Text style={styles.latestVideosText}>
                Latest Videos
              </Text>
              <Trending  posts={[{id:1},{id:2},{id:3}] ?? []}/>
            </View>
          </View>
        )}
        ListEmptyComponent={()=>(
       <EmptyState
          title="No Videos Found"
          subtitle="Please upload video"/>
        )}
      />

    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A0A1A',
//     padding: 16,

//   },
//   header: {
//     marginBottom: 16,
//   },
//   welcomeText: {
//     color: '#888',
//     fontSize: 14,
//   },
//   titleText: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   searchInput: {
//     flex: 1,
//     backgroundColor: '#222',
//     borderRadius: 8,
//     padding: 12,
//     color: '#fff',
//     marginRight: 8,
//   },
//   searchButton: {
//     backgroundColor: '#7859F0',
//     borderRadius: 8,
//     padding: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 48,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   featuredRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   featuredCard: {
//     width: '32%',
//     height: 160,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   featuredImage: {
//     width: '100%',
//     height: '100%',
//   },
//   videoCard: {
//     marginBottom: 20,
//   },
//   cardContent: {
//     position: 'relative',
//     borderRadius: 12,
//     overflow: 'hidden',
//     height: 200,
//   },
//   cardImage: {
//     width: '100%',
//     height: '100%',
//   },

//   playCircle: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#fff',
//   },
//   cardDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   videoInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatarImage: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     marginRight: 12,
//   },
//   videoTextContainer: {
//     flexDirection: 'column',
//   },
//   videoTitle: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   channelName: {
//     color: '#888',
//     fontSize: 14,
//   },
//   playButtonContainer: {
//     position: 'absolute',
//     bottom: 16,
//     right: 16,
//   },
//   playButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    padding: 16,
  },
  welcomeText: {
    color: '#888',
    fontSize: 14,
  },
  titleText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    color: '#fff',
    fontSize: 24,

    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20,
    padding: 10,
  },
  latestVideosText: {
    fontSize: 18,  // text-lg equivalent
  marginTop:12,
    color: '#f5f5f5', // text-gray-100 equivalent
    marginBottom: 12, // mb-3 equivalent
  },
})
export default Home;