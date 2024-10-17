import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

interface Story {
  id: string;
  image: string;
  created_at: Date;
  location: {
    coords: {
      latitude: number;
      longitude: number;
    };
  };
}

interface StoryModalProps {
  visible: boolean;
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const StoryModal: React.FC<StoryModalProps> = ({
  visible,
  stories,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [timeRemaining, setTimeRemaining] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (visible && stories.length > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visible, stories.length]);

  useEffect(() => {
    if (timeRemaining === 0) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setTimeRemaining(5); // Reset timer for next story
      } else {
        onClose();
      }
    }
  }, [timeRemaining, currentIndex, stories.length, onClose]);

  if (!visible || stories.length === 0 || !stories[currentIndex]) return null;

  const currentStory = stories[currentIndex];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Image source={{ uri: currentStory.image }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.timer}>{timeRemaining}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  image: {
    width: 400,
    height: 300,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
  },
  timer: {
    fontSize: 24,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default StoryModal;