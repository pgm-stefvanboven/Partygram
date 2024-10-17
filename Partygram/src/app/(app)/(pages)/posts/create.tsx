import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { supabase } from "@/src/core/api/supabase";
import { useNavigation } from "@react-navigation/native";

const PostCreateScreen = () => {
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) {
          setUserId(user.id);
          console.log("Loaded user ID:", user.id);
        } else {
          console.error("No user ID found in session");
          Alert.alert("Error", "User ID not found. Please log in again.");
        }
      } catch (error) {
        console.error("Failed to load user ID", error);
        Alert.alert("Error", "Failed to load user ID. Please try again.");
      }
    };

    loadUserId();
  }, []);

  const handleChoosePhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Failed to pick image", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error("Failed to get location", error);
      Alert.alert("Error", "Failed to get location. Please try again.");
    }
  };

  const handleSubmit = async () => {
    console.log("Description:", description);
    console.log("Image:", image);
    console.log("Location:", location);
    console.log("User ID:", userId);

    if (!description || !image || !location || !userId) {
      Alert.alert("Error", "Please fill all the fields and choose a photo");
      return;
    }

    try {
      const { error } = await supabase.from("posts").insert({
        description,
        image,
        location: {
          coords: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        },
        user_id: userId,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Failed to add post", error);
        Alert.alert("Error", "Something went wrong. Please try again later.");
      } else {
        Alert.alert("Success", "Post added successfully");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Unexpected error", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose Photo</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={handleGetLocation}>
        <Text style={styles.buttonText}>Get Location</Text>
      </TouchableOpacity>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
});

export default PostCreateScreen;