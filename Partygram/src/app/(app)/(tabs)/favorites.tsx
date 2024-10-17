import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<{ id: string }[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoritePosts = await AsyncStorage.getItem("favorites");
        if (favoritePosts) {
          setFavorites(JSON.parse(favoritePosts));
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = async (postId: any) => {
    try {
      const updatedFavorites = favorites.filter((post) => post.id !== postId);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text>{item.description}</Text>
      <TouchableOpacity onPress={() => removeFavorite(item.id)}>
        <Text style={styles.removeText}>Remove from Favorites</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  removeText: {
    color: "red",
    marginTop: 5,
  },
});

export default FavoritesScreen;