import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { supabase } from "@/src/core/api/supabase";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  username?: string; // Add a username field to the Message interface
}

interface RouteParams {
  id: string;
}

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id: threadId } = route.params as RouteParams;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: "Chat" });
    fetchSession();
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Re-fetch every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error);
      return;
    }

    const user = data?.session?.user;

    if (user) {
      setSessionUserId(user.id);
    }
  };

  const fetchMessages = async () => {
    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
    } else {
      // Fetch usernames for each sender_id
      const messagesWithUsernames = await Promise.all(
        messagesData.map(async (message) => {
          const { data: userData, error: userError } = await supabase
            .from("profiles") // Assuming you have a 'profiles' table with user data
            .select("username")
            .eq("id", message.sender_id)
            .single();

          if (userError) {
            console.error("Error fetching user data:", userError);
            return { ...message, username: "Unknown" };
          }

          return { ...message, username: userData?.username || "Unknown" };
        })
      );

      setMessages(messagesWithUsernames);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      return;
    }

    const user = sessionData?.session?.user;

    if (!user) {
      console.error("User not found in session");
      return;
    }

    // Check if the thread exists
    const { data: threadData, error: threadError } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("id", threadId)
      .maybeSingle(); // Use maybeSingle to handle the case of no rows

    if (threadError) {
      console.error("Error fetching chat thread:", threadError);
      return;
    }

    // If thread does not exist, create it
    if (!threadData) {
      const { data: newThread, error: createThreadError } = await supabase
        .from("chat_threads")
        .insert({
          id: threadId,
          participant_1_id: user.id,
          participant_2_id: user.id,
          last_message: newMessage,
          last_message_time: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single(); // Expecting a single row to be returned after insertion

      if (createThreadError) {
        console.error("Error creating chat thread:", createThreadError);
        return;
      }
    }

    // Insert the new message
    const { error: messageError } = await supabase.from("messages").insert({
      content: newMessage,
      thread_id: threadId,
      sender_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (messageError) {
      console.error("Error sending message:", messageError);
    } else {
      setNewMessage("");
      fetchMessages(); // Re-fetch messages after sending
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageItem}>
      <Text>
        {item.sender_id === sessionUserId ? "You" : item.username}:{" "}
        {item.content}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.created_at).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messagesList: {
    padding: 10,
    flex: 1,
  },
  messageItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 5,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
  },
});

export default ChatScreen;