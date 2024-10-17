import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "@/src/core/api/supabase";
import {
  ActionSheetProvider,
  connectActionSheet,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import StoryView from "../../../components/Shared/Story/StoryView";
import PostItem from "../../../components/Shared/Post/PostItem";
import StoryModal from "../../../components/Shared/Story/StoryModal";
import { User } from "@supabase/supabase-js";
import {
  getLikeByPostAndOwner,
  createLike,
  deleteLike,
} from "../../../core/modules/likes/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Story {
  id: string;
  userId: string;
  image: string;
  created_at: Date;
  location: {
    coords: {
      latitude: number;
      longitude: number;
    };
  };
}

interface Post {
  id: string;
  image: string;
  description: string;
  hashtags: string[];
  comments: number;
  likes: number;
  created_at: Date;
  liked: boolean;
  user_id: string;
}

const HomeScreen = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLikes, setShowLikes] = useState(true);
  const [showStories, setShowStories] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        setCurrentUser(data.user);
        if (data.user) {
          fetchPosts(data.user); // Fetch posts only after user is fetched
        }
      } else {
        console.error("Error fetching user:", error);
      }
    };

    const fetchSettings = async () => {
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

    fetchStories();
    fetchUser();
    fetchSettings();

    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={handleAddButtonPress}>
            <FontAwesome name="plus" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/threads")}
            style={{ marginLeft: 15 }}
          >
            <FontAwesome name="comments" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .gt(
          "created_at",
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) {
        console.error(error);
        return;
      }

      if (data && Array.isArray(data)) {
        const latestStories = data.reduce((acc: Story[], story: Story) => {
          try {
            if (typeof story.location === "string") {
              story.location = JSON.parse(story.location);
            }
          } catch (parseError) {
            console.error("Failed to parse location:", parseError);
            return acc;
          }

          const existing = acc.find((s) => s.userId === story.userId);
          if (
            !existing ||
            new Date(existing.created_at) < new Date(story.created_at)
          ) {
            return acc.filter((s) => s.userId !== story.userId).concat(story);
          }
          return acc;
        }, []);
        setStories(latestStories);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    }
  };

  const fetchPosts = async (currentUser: User) => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error(error);
    } else if (data && Array.isArray(data)) {
      const postsWithLikes = await Promise.all(
        data.map(async (post) => {
          const like = await getLikeByPostAndOwner(post.id, currentUser.id);
          return { ...post, likes: post.likes ?? 0, liked: !!like }; // Ensure likes is a number
        })
      );
      setPosts(postsWithLikes);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Re-fetch stories and posts
    fetchStories();
    if (currentUser) {
      fetchPosts(currentUser);
    }

    setRefreshing(false); // Stop the refreshing animation
  }, [currentUser]);

  const handleHashtagPress = (hashtag: string) => {
    router.push(`/search?hashtag=${hashtag}`);
  };

  const handlePostPress = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const loadMorePosts = async () => {
    setLoadMore(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(posts.length, posts.length + 9);

    if (error) {
      console.error(error);
    } else if (data && Array.isArray(data)) {
      const morePostsWithUserLiked = data.map((post) => ({
        ...post,
        liked: false, // Voeg liked toe als false
      }));
      setPosts((prevPosts) => [...prevPosts, ...morePostsWithUserLiked]);
    }
    setLoadMore(false);
  };

  const handleAddButtonPress = () => {
    showActionSheetWithOptions(
      {
        options: ["Cancel", "Add Post", "Add Story"],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          handleAddPost();
        } else if (buttonIndex === 2) {
          handleAddStory();
        }
      }
    );
  };

  const handleAddPost = () => {
    router.push("/posts/create");
  };

  const handleAddStory = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const location = await Location.getCurrentPositionAsync({});
      const { error } = await supabase.from("stories").insert({
        image: result.assets[0].uri,
        location: {
          coords: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error(error);
      } else {
        fetchStories();
      }
    }
  };

  const handleStoryPress = (index: number) => {
    setCurrentStoryIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLikePress = async (postId: string, liked: boolean) => {
    if (!currentUser) {
      console.error("No user is logged in");
      return;
    }

    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) return;

    const updatedPosts = [...posts];
    const post = updatedPosts[postIndex];

    if (liked) {
      await createLike(postId, currentUser.id);
      post.likes += 1;
    } else {
      await deleteLike(postId, currentUser.id);
      post.likes -= 1;
    }

    post.liked = liked;
    setPosts(updatedPosts);
  };

  return (
    <View style={styles.container}>
      {showStories && (
        <FlatList
          style={styles.storyItem}
          data={stories}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleStoryPress(index)}>
              <StoryView story={item} />
            </TouchableOpacity>
          )}
        />
      )}
      <FlatList
        style={styles.postItem}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            onPress={() => handlePostPress(item.id)}
            onHashtagPress={handleHashtagPress}
            onLikePress={handleLikePress}
            showLikes={showLikes}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          posts.length >= 10 ? (
            <TouchableOpacity
              onPress={loadMorePosts}
              style={styles.loadMoreButton}
            >
              <Text>Load More</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      <StoryModal
        visible={modalVisible}
        stories={stories}
        initialIndex={currentStoryIndex}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  storyItem: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginLeft: 10,
  },
  postItem: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  loadMoreButton: {
    padding: 10,
    alignItems: "center",
  },
  addPostButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
});

const ConnectedHomeScreen = connectActionSheet(HomeScreen);

export default () => (
  <ActionSheetProvider>
    <ConnectedHomeScreen />
  </ActionSheetProvider>
);
