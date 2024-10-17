import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { storeData, getData } from "../../../core/modules/data/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfiles } from "@/src/core/modules/profiles/api";
import { supabase } from "@/src/core/api/supabase";
import { router, Href } from "expo-router";

interface PostItemProps {
  post: {
    id: string;
    image: string;
    description: string;
    hashtags?: string[];
    comments: number;
    likes: number;
    liked: boolean;
    created_at: Date;
    user_id: string;
  };
  onPress: () => void;
  onHashtagPress: (hashtag: string) => void;
  onLikePress: (postId: string, liked: boolean) => void;
  showLikes: boolean;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  onPress,
  onHashtagPress,
  onLikePress,
  showLikes,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [latestComment, setLatestComment] = useState<string | null>(null);
  const [latestCommentUser, setLatestCommentUser] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profiles = await getProfiles();
        const userProfile = profiles?.find(
          (profile: any) => profile.id === post.user_id
        );
        if (userProfile) {
          setUser(userProfile);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem("favorites");
        if (favorites) {
          const favoritesArray = JSON.parse(favorites);
          setIsFavorite(
            favoritesArray.some(
              (favPost: { id: string }) => favPost.id === post.id
            )
          );
        }
      } catch (error) {
        console.error("Failed to check if post is favorite:", error);
      }
    };

    const fetchPostData = async () => {
      try {
        const data = await getData();
        const postLikes = data.likes[post.id]?.liked ?? post.liked;
        const postLikesCount = data.likes[post.id]?.likes ?? post.likes;
        setLiked(postLikes);
        setLikes(postLikesCount);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchLatestComment = async () => {
      try {
        const { data: comments, error } = await supabase
          .from("comments")
          .select("content, user_id")
          .eq("post_id", post.id)
          .order("created_at", { ascending: false })
          .limit(1);
        if (error) {
          throw error;
        }
        if (comments && comments.length > 0) {
          const latestComment = comments[0];
          setLatestComment(latestComment.content);

          const { data: user, error: userError } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", latestComment.user_id)
            .single();
          if (userError) {
            throw userError;
          }
          setLatestCommentUser(user.username);
        } else {
          setLatestComment(null);
          setLatestCommentUser(null);
        }
      } catch (error) {
        console.error("Error fetching latest comment: ", error);
      }
    };

    fetchData();
    checkFavorite();
    fetchPostData();
    fetchLatestComment();
  }, [post.id]);

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      let favoritesArray = favorites ? JSON.parse(favorites) : [];
      if (isFavorite) {
        favoritesArray = favoritesArray.filter(
          (favPost: { id: string }) => favPost.id !== post.id
        );
      } else {
        favoritesArray.push(post);
      }
      await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleLikePress = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);

    let newLikesCount = likes ?? 0; // Ensure likes is a number

    if (newLikedState) {
      newLikesCount += 1;
    } else if (newLikesCount > 0) {
      newLikesCount -= 1;
    }

    setLikes(newLikesCount);
    onLikePress(post.id, newLikedState);

    try {
      const data = await getData();
      data.likes[post.id] = { liked: newLikedState, likes: newLikesCount };
      await storeData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const renderHashtags = (description: string) => {
    const words = description.split(" ");
    return words.map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <Text
            key={index}
            style={styles.hashtag}
            onPress={() => onHashtagPress(word.substring(1))}
          >
            {word}
          </Text>
        );
      }
      return <Text key={index}>{word} </Text>;
    });
  };

  const handleUserPress = (id: string) => {
    router.push(`/profiles/${id}`);
  };

  const handleCommentsPress = () => {
    router.push(`/comments/${post.id}`);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.content}>
        {isLoading ? (
          <Text style={styles.user}>Loading user data...</Text>
        ) : user ? (
          <TouchableOpacity onPress={() => handleUserPress(user.id)}>
            <Text style={styles.user}>
              Posted by:<Text style={styles.username}> {user.username}</Text>
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.user}>User not found</Text>
        )}
        <Text style={styles.description}>
          {renderHashtags(post.description)}
        </Text>
        <TouchableOpacity onPress={handleCommentsPress}>
          <View style={styles.hashtags}>
            <Text>
              <Icon name="comment" size={16} color="#333" /> latest comment:{" "}
              {latestComment ? (
                <>
                  <Text style={styles.hashtag}>{latestCommentUser}</Text> -{" "}
                  {latestComment}
                </>
              ) : (
                "No comments yet"
              )}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.footer}>
          {showLikes && (
            <TouchableOpacity
              onPress={handleLikePress}
              style={styles.likeButton}
            >
              <Icon
                name={liked ? "heart" : "heart-o"}
                size={24}
                color={liked ? "red" : "black"}
              />
              <Text
                style={[styles.likesText, { color: liked ? "red" : "black" }]}
              >
                {isNaN(likes) || likes === undefined
                  ? "0 likes"
                  : `${likes} likes`}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={toggleFavorite} style={styles.likeButton}>
            <Icon
              name={isFavorite ? "star" : "star-o"}
              size={24}
              color={isFavorite ? "gold" : "gray"}
            />
            <Text
              style={[
                styles.likesText,
                { color: isFavorite ? "gold" : "gray" },
              ]}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 15,
    backgroundColor: "#f8f8f8",
  },
  user: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    color: "#333",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e90ff",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  hashtags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  hashtag: {
    color: "#1e90ff",
    marginRight: 8,
    marginBottom: 5,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
  },
});

export default PostItem;
