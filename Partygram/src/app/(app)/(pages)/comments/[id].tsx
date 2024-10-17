import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "@/src/core/api/supabase";
import { User } from "@supabase/supabase-js";

const CommentsScreen = () => {
  const { id: postId } = useLocalSearchParams();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Comments" });

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (data) {
        setUser(data.user);
      }
    };

    const fetchComments = async () => {
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId);

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
      } else if (commentsData) {
        const userIds = commentsData.map((comment) => comment.user_id);
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", userIds);

        if (usersError) {
          console.error("Error fetching users:", usersError);
        } else if (usersData) {
          const commentsWithUsernames = commentsData.map((comment) => {
            const user = usersData.find((u) => u.id === comment.user_id);
            return {
              ...comment,
              username: user ? user.username : "Unknown User",
            };
          });
          setComments(commentsWithUsernames);
        }
      }
    };

    fetchUser();
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    if (!user) {
      console.error("User not logged in");
      return;
    }

    const { data, error }: { data: any; error: any } = await supabase
      .from("comments")
      .insert([{ post_id: postId, user_id: user.id, content: newComment }])
      .single();

    if (error) {
      console.error("Error adding comment:", error.message);
    } else if (data) {
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user_id)
        .single();
      if (userError) {
        console.error("Error fetching user:", userError);
      } else if (userData) {
        setComments([...comments, { ...data, username: userData.username }]);
        setNewComment("");
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.username}>
              🎉 {item.username || "Unknown User"}{" "}
              <Text style={styles.says}>
                says:{" "}
                <Text style={styles.commentContent}>
                  {item.content || "No content"}
                </Text>
              </Text>
            </Text>
            <Text style={styles.commentDate}>
              🕒{" "}
              {item.created_at
                ? new Date(item.created_at).toLocaleString()
                : "Date not available"}
            </Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Add a comment"
      />
      <Button title="Add Comment" onPress={handleAddComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  commentItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#FF6347",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FF6347",
    marginBottom: 5,
  },
  says: {
    fontStyle: "italic",
    color: "#333",
  },
  commentContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: "#888",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
});

export default CommentsScreen;
