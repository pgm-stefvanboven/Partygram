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
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { fetchUserPosts } from "../../../core/modules/posts/api";
import { fetchLoggedInUser } from "../../../core/modules/profiles/api";
import { updateUserAvatar } from "../../../core/modules/auth/api";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

const ProfileScreen = () => {
  const [user, setUser] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedInUser = await fetchLoggedInUser();
        if (loggedInUser) {
          setUser(loggedInUser);
          const userPosts = await fetchUserPosts(loggedInUser.id);
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

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push("/profiles/settings")}>
          <Icon
            name="cog"
            size={24}
            color="#ffff"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handlePostPress = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const handleAvatarPress = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      try {
        const updatedUser = await updateUserAvatar(user.id, selectedImage);
        setUser(updatedUser);
      } catch (error) {
        console.error("Error updating avatar: ", error);
        alert("Error updating avatar");
      }
    }
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
            <TouchableOpacity onPress={handleAvatarPress}>
              <Image
                source={
                  avatarUrl
                    ? { uri: avatarUrl }
                    : require("../../../../assets/images/default_avatar.png")
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.profileDetails}>
              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.postCount}>
                {posts ? posts.length : 0} posts
              </Text>
              <Text style={styles.fullName}>
                {user.first_name} {user.last_name}
              </Text>
              <Button
                title="Logout"
                onPress={() => router.push("/auth/login")}
                color="#FF0000"
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
        <View style={styles.authContainer}>
          <Text style={styles.authMessage}>
            Nog niet ingelogd? Of nog geen account? Log je in of registreer en
            bekijk de fantastische wereld van Partygram!
          </Text>
          <View style={styles.authButtons}>
            <Button
              title="Login"
              onPress={() => router.push("/login")}
              color="#1E90FF"
            />
            <Button
              title="Register"
              onPress={() => router.push("/auth/register")}
              color="#32CD32"
            />
          </View>
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
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
  },
  authMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  authButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
});

export default ProfileScreen;
