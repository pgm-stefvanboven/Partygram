import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface AddPostButtonProps {
  onPress: () => void;
}

const AddPostButton: React.FC<AddPostButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>Add Post</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: "#32cd32",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default AddPostButton;