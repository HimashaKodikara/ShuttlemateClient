import { useState, useRef } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import playIc from '../../assets/icons/play.png';
import Menu from '../../assets/icons/menu.png';
import LottieView from 'lottie-react-native';

const VideoCard = ({ videoName, videoCreator, videoCreatorPhoto, imgUrl, videoUrl }) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef(null);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    playerRef.current = player;
  });

  const handlePlay = () => {
    setShowPlayer(true);
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  // Handle video end
  const handleVideoEnd = (status) => {
    if (status.didJustFinish) {
      setShowPlayer(false);
      playerRef.current?.stop();
      playerRef.current?.unloadAsync?.();
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            <Image
           source={{ uri: videoCreatorPhoto }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.title} numberOfLines={1}>
              {videoName}
            </Text>
            <Text style={styles.creator} numberOfLines={1}>
              {videoCreator}
            </Text>
          </View>
        </View>
        <View style={styles.menuIconWrapper}>
          {/* <Image source={Menu} style={styles.menuIcon} resizeMode="contain" /> */}
           <LottieView
              source={require('../../assets/lottie/reveal-loading.json')} // Adjust the path to your Lottie file
              autoPlay
              loop
              style={{ width: 50, height: 50 }}
            />
        </View>
      </View>

      {/* Video or Thumbnail */}
      <View style={styles.mediaContainer}>
        {showPlayer ? (
          <View style={styles.videoWrapper}>
            <VideoView
              player={player}
              style={styles.video}
              allowsFullscreen
              allowsPictureInPicture
              onPlaybackStatusUpdate={handleVideoEnd}
              
            />
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePlay}
            style={styles.thumbnailWrapper}
          >
            <Image
              source={{ uri: imgUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <Image source={playIc} style={styles.playIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 56,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  textWrapper: {
    justifyContent: "center",
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  creator: {
    fontSize: 12,
    color: "#ccc",
    fontWeight: "400",
  },
  menuIconWrapper: {
    paddingTop: 8,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  mediaContainer: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
  },
  videoWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  thumbnailWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  playIcon: {
    position: "absolute",
    width: 48,
    height: 48,
  },
});

export default VideoCard;