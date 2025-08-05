import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.242.34:5000"; // adjust if needed

export default function UploadScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState(new Date());

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: deadline,
      onChange: (event, selectedDate) => {
        if (selectedDate) setDeadline(selectedDate);
      },
      mode: "date",
      is24Hour: true,
    });
  };

  const handleUpload = async () => {
    if (!title || !description || !startingBid || !category || !deadline) {
      Alert.alert("Please fill in all fields");
      return;
    }

    const token = await AsyncStorage.getItem("token");

    const body = {
      title,
      description,
      starting_bid: startingBid,
      category,
      deadline: deadline.toISOString(),
      images: [], // optional, can be filled later
    };

    try {
      const res = await fetch(`${BASE_URL}/api/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      Alert.alert("Success", "Item uploaded successfully!");
      setTitle("");
      setDescription("");
      setStartingBid("");
      setCategory("");
      setDeadline(new Date());
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
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      {/* Deadline Date Picker */}
      <TouchableOpacity onPress={showDatePicker} style={styles.input}>
        <Text>{deadline.toDateString()}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleUpload} style={styles.button}>
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
  button: {
    backgroundColor: "#287778",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});