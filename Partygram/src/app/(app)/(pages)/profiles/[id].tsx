import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getUserById } from "../../../../core/modules/profiles/api"; // Import getUserById
import { fetchUserPosts } from "../../../../core/modules/posts/api";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";

const ProfileDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id: userId } = (route.params as { id: string }) || {};
  const [user, setUser] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set the title of the profile with the username
    navigation.setOptions({ title: user ? user.username : "Profile" });
    if (!userId) {
      console.error("No userId provided!");
      return;
    }

    console.log("Received userId:", userId);

    const fetchData = async () => {
      try {
        const userData = await getUserById(userId); // Fetch the user data based on userId
        if (userData && userData.length > 0) {
          setUser(userData[0]); // Assuming userData is an array
          const userPosts = await fetchUserPosts(userId); // Fetch posts for the fetched user
          setPosts(userPosts);
        } else {
          setUser(null);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setUser(null);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handlePostPress = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handlePostPress(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.postImage} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const avatarUrl = user ? user.avatar_url : "";

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={styles.profileHeader}>
            <Image
              source={
                avatarUrl
                  ? { uri: avatarUrl }
                  : require("../../../../../assets/images/default_avatar.png")
              }
              style={styles.avatar}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.fullName}>
                {user.first_name} {user.last_name}
              </Text>
              <Text style={styles.postCount}>
                {posts ? posts.length : 0} posts
              </Text>
              <Button
                title="Start Chat"
                onPress={() => router.push(`/threads/${user.id}`)}
                color="#1E90FF"
              />
            </View>
          </View>
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            style={styles.grid}
            columnWrapperStyle={styles.row}
          />
        </>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>
            User not found. Please try again later.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: "cover",
    marginRight: 20,
  },
  profileDetails: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postCount: {
    fontSize: 14,
    color: "#888",
  },
  fullName: {
    fontSize: 14,
    color: "#555",
  },
  grid: {
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
  },
  gridItem: {
    flex: 1,
    margin: 2,
    height: 120,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 18,
    color: "#FF0000",
  },
});

export default ProfileDetailsScreen;