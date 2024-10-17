import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/core/api/supabase";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";

// Function to fetch post by ID
const fetchPostById = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error in fetchPostById:", error);
    throw error;
  }
};

// Function to fetch user profile by user ID
const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      throw new Error(error.message);
    }
    return data as { username: string }; // Ensure the return type matches the expected state type
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    throw error;
  }
};

// Function to fetch the latest comment
const fetchLatestComment = async (postId: string) => {
  try {
    const { data: comments, error } = await supabase
      .from("comments")
      .select("content, user_id")
      .eq("post_id", postId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      throw error;
    }

    if (comments && comments.length > 0) {
      const latestComment = comments[0];
      const { data: user, error: userError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", latestComment.user_id)
        .single();

      if (userError) {
        throw userError;
      }

      return { content: latestComment.content, username: user.username };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching latest comment: ", error);
    return null;
  }
};

// PostDetailScreen component
const PostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };

  const [user, setUser] = useState<{ username: string } | null>(null);
  const [latestComment, setLatestComment] = useState<{
    content: string;
    username: string;
  } | null>(null);
  const [liked, setLiked] = useState<boolean>(false);

  const {
    data: post,
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: postError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id),
  });

  useEffect(() => {
    if (post) {
      navigation.setOptions({ title: post.description });
      fetchUserProfile(post.user_id).then(setUser).catch(console.error);
      fetchLatestComment(post.id).then(setLatestComment).catch(console.error);
    }
  }, [post, navigation]);

  if (isLoadingPost) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isErrorPost) {
    console.error("Error fetching post:", postError);
    return (
      <View style={styles.centeredContainer}>
        <Text>Something went wrong</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Post does not exist</Text>
      </View>
    );
  }

  const handleUserPress = (id: string) => {
    router.push(`/profiles/${id}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.description}>{post.description}</Text>
        {user ? (
          <TouchableOpacity onPress={() => handleUserPress(post.user_id)}>
            <Text style={styles.user}>
              Posted by: <Text style={styles.username}>{user.username}</Text>
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.user}>Loading user data...</Text>
        )}

        <TouchableOpacity
          onPress={() => {
            router.push(`/comments/${post.id}`);
          }}
        >
          <Text style={styles.user}>
            <Icon name="comment" size={16} color="#333" /> Comments
            {latestComment ? (
              <>
                : <Text style={styles.username}>{latestComment.username}</Text>{" "}
                - {latestComment.content}
              </>
            ) : (
              ": No comments yet"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  contentContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  user: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
  },
  username: {
    color: "#1e90ff",
    fontWeight: "bold",
  },
});

export default PostDetailScreen;