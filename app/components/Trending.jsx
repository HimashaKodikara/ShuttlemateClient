import { useState, useCallback } from "react";
import { ResizeMode, Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

//import { icons } from "../constants";
import playicon from "../../assets/icons/play.png";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ item, activeItem }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      style={styles.itemWrapper}
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          style={styles.thumbnailWrapper}
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.imgUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
            imageStyle={styles.thumbnailImage}
          />

          <Image
            source={playicon}
            style={styles.playIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts && posts.length > 0 ? posts[0].$id : null);

  const viewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].item) {
      setActiveItem(viewableItems[0].item.$id);
    }
  }, []);

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
    />
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    marginRight: 20,
    
    
  },
  video: {
    width: 208, // w-52
    height: 288, // h-72
    marginTop: 12,
    borderRadius: 33,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  thumbnailWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    width: 208, // w-52
    height: 288, // h-72
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  thumbnailImage: {
    borderRadius: 33,
  },
  playIcon: {
    width: 48, // w-12
    height: 48, // h-12
    position: "absolute",
  },
});

export default Trending;