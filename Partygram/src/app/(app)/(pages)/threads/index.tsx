import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "@/src/core/api/supabase";
import { router } from "expo-router";

interface Thread {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message: string;
  updated_at: string;
}

const ThreadsOverview = () => {
  const [threads, setThreads] = useState<
    ArrayLike<
      Thread & {
        participant_1_username: string;
        participant_2_username: string;
      }
    >
  >([]);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Storing the logged-in user's ID
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: "Threads" });
    fetchLoggedInUser();
    fetchThreads();
  }, []);

  const fetchLoggedInUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Error fetching logged-in user:", error);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching user profile:", profileError);
      return;
    }

    setUsername(profile.username);
    setUserId(user.id); // Save the logged-in user's ID
  };

  const fetchThreads = async () => {
    const { data: threads, error: threadsError } = await supabase
      .from("chat_threads")
      .select("*")
      .order("updated_at", { ascending: false });

    if (threadsError) {
      console.error("Error fetching threads:", threadsError);
      return;
    }

    const participantIds = [
      ...new Set(
        threads.flatMap((thread) => [
          thread.participant_1_id,
          thread.participant_2_id,
        ])
      ),
    ];

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", participantIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return;
    }

    const profilesMap: { [key: string]: string } = profiles.reduce(
      (acc: { [key: string]: string }, profile) => {
        acc[profile.id] = profile.username;
        return acc;
      },
      {}
    );

    const threadsWithUsernames = threads.map((thread) => ({
      ...thread,
      participant_1_username: profilesMap[thread.participant_1_id],
      participant_2_username: profilesMap[thread.participant_2_id],
    }));

    setThreads(threadsWithUsernames);
  };

  const handleThreadPress = (threadId: string) => {
    router.push(`/threads/${threadId}`);
  };

  const renderItem = ({
    item,
  }: {
    item: Thread & {
      participant_1_username: string;
      participant_2_username: string;
    };
  }) => {
    // Correct comparison between the logged-in user's ID and thread participant IDs
    const participants = `You are talking to ${
      item.participant_1_id === userId
        ? item.participant_2_username
        : item.participant_1_username
    }`;

    return (
      <TouchableOpacity
        onPress={() => handleThreadPress(item.id)}
        style={styles.threadItem}
      >
        <Text style={styles.threadText}>{participants}</Text>
        <Text style={styles.lastMessage}>
          {item.last_message || "No messages yet"}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.updated_at).toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {threads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            There are no threads yet. Go to a profile and start a conversation.
          </Text>
        </View>
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  threadItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  threadText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

export default ThreadsOverview;