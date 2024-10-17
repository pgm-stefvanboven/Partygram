import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "@/src/core/api/supabase";
import { router } from "expo-router";

const SearchScreen = () => {
  const route = useRoute();
  const initialHashtag = (route.params as { hashtag?: string })?.hashtag || "";
  const [searchQuery, setSearchQuery] = useState(initialHashtag);
  const [results, setResults] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (searchQuery.length >= 3) {
      fetchSearchResults(searchQuery);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const fetchSearchResults = async (query: string) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .ilike("description", `%${query}%`);

    if (error) {
      console.error("Error fetching search results:", error);
    } else {
      setResults(data);
    }
  };

  const handlePostPress = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handlePostPress(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          style={styles.grid}
        />
      ) : (
        searchQuery.length >= 3 && (
          <View style={styles.noResults}>
            <Text>No results found</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  grid: {
    flex: 1,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    height: 120,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchScreen;