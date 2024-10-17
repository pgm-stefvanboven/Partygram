import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface AddStoryButtonProps {
  onPress: () => void;
}

const AddStoryButton: React.FC<AddStoryButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>Add Story</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: "#1e90ff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default AddStoryButton;