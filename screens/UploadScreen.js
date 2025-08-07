import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL } from "../utils/api";

export default function UploadScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [imageUri, setImageUri] = useState(null);

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: deadline,
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          const updated = new Date(deadline);
          updated.setFullYear(selectedDate.getFullYear());
          updated.setMonth(selectedDate.getMonth());
          updated.setDate(selectedDate.getDate());
          setDeadline(updated);
        }
      },
    });
  };

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: deadline,
      mode: "time",
      is24Hour: true,
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          const updated = new Date(deadline);
          updated.setHours(selectedTime.getHours());
          updated.setMinutes(selectedTime.getMinutes());
          setDeadline(updated);
        }
      },
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!title || !description || !startingBid || !deadline) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("starting_bid", startingBid);
    formData.append("deadline", deadline.toISOString());

    if (imageUri) {
      formData.append("image", {
        uri: imageUri,
        name: "item.jpg",
        type: "image/jpeg",
      });
    }

    try {
      const res = await fetch(`${BASE_URL}/api/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      Alert.alert("Success", "Item uploaded successfully!");
      setTitle("");
      setDescription("");
      setStartingBid("");
      setDeadline(new Date());
      setImageUri(null);
    } catch (err) {
      Alert.alert("Error", err.message);
      console.error("Upload error:", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Upload Item</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 60 }]}
        multiline
      />
      <TextInput
        placeholder="Starting Bid ($)"
        value={startingBid}
        onChangeText={setStartingBid}
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.deadlineContainer}>
        <Text style={styles.label}>Select Deadline:</Text>

        <View style={styles.datetimeRow}>
          <TouchableOpacity
            onPress={showDatePicker}
            style={styles.datetimeButton}
          >
            <Text style={styles.datetimeText}>{deadline.toDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showTimePicker}
            style={styles.datetimeButton}
          >
            <Text style={styles.datetimeText}>
              {deadline.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subheading}>Add Item Image</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
        <Text style={styles.buttonText}>Upload Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    justifyContent: "center",
  },
  datetimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  datetimeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: "center",
  },
  datetimeText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  imageButton: {
    flex: 1,
    backgroundColor: "#888",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#287778",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  previewImage: {
    width: "100%",
    height: 180,
    marginBottom: 20,
    borderRadius: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  deadlineContainer: {
    width: "100%",
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
});
