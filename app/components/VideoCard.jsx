import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import { icons } from "../../constants/icons.js";

const VideoCard = ({ videoName, videoCreator, avatar, imgUrl, video }) => {
  const [play, setPlay] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatar }}
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
          <Image
            source={{ uri: avatar }}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
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
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          style={styles.thumbnailWrapper}
        >
          <Image
            source={{ uri: imgUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />

          {/* <Image
            source={icons.play}
            style={styles.playIcon}
            resizeMode="contain"
          /> */}
        </TouchableOpacity>
      )}
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
    gap: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc", // Replace with your secondary color
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
    fontSize: 14,
    fontWeight: "600", // 'psemibold'
    color: "white",
  },
  creator: {
    fontSize: 12,
    color: "#ccc",
    fontWeight: "400", // 'pregular'
  },
  menuIconWrapper: {
    paddingTop: 8,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  video: {
    width: "100%",
    marginTop: 12,
    height: 240,
    borderRadius: 16,
  },
  thumbnailWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 12,
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
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
