import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const SettingsScreen = () => {
  const [showLikes, setShowLikes] = useState(true); // Add showLikes state
  const [showStories, setShowStories] = useState(true); // Add showStories state
  const navigation = useNavigation(); // Use useNavigation hook

  useEffect(() => {
    // Set the title of the screen to "Settings"
    navigation.setOptions({ title: "Settings" });

    const loadSettings = async () => {
      try {
        const likes = await AsyncStorage.getItem("showLikes");
        const stories = await AsyncStorage.getItem("showStories");

        if (likes !== null) {
          setShowLikes(JSON.parse(likes));
        }

        if (stories !== null) {
          setShowStories(JSON.parse(stories));
        }
      } catch (e) {
        console.error("Failed to load settings.", e);
      }
    };

    loadSettings();
  }, [navigation]);

  const toggleLikes = async () => {
    try {
      const newValue = !showLikes;
      setShowLikes(newValue);
      await AsyncStorage.setItem("showLikes", JSON.stringify(newValue));
    } catch (e) {
      console.error("Failed to save setting.", e);
    }
  };

  const toggleStories = async () => {
    try {
      const newValue = !showStories;
      setShowStories(newValue);
      await AsyncStorage.setItem("showStories", JSON.stringify(newValue));
    } catch (e) {
      console.error("Failed to save setting.", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.setting}>
        <Text style={styles.label}>Toon aantal likes</Text>
        <Switch value={showLikes} onValueChange={toggleLikes} />
      </View>
      <View style={styles.setting}>
        <Text style={styles.label}>Toon stories</Text>
        <Switch value={showStories} onValueChange={toggleStories} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
  },
});

export default SettingsScreen;