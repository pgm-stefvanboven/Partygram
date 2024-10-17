import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface StoryViewProps {
  story: {
    id: string;
    image: string;
    created_at: Date;
    location: {
      coords: {
        latitude: number;
        longitude: number;
      };
    };
  };
}

const StoryView: React.FC<StoryViewProps> = ({ story }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: story.image }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 50,
  },
});

export default StoryView;