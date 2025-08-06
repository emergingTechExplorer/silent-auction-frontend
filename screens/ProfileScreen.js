import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const BASE_URL = "http://192.168.242.34:5000"; // Replace with your local server IP

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      const parsedUser = JSON.parse(user);
      const uid = parsedUser._id || parsedUser.id;
      setUserId(uid);

      const response = await fetch(`${BASE_URL}/api/users/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch profile");

      setName(data.name || "");
      setEmail(data.email || "");

      if (data.profile_image) {
        setImageUri(`${BASE_URL}/${data.profile_image}?t=${Date.now()}`);
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      Alert.alert("Error", err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });

    if (!result.canceled && result.assets.length > 0) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();

      formData.append("profileImage", {
        uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(`${BASE_URL}/api/users/${userId}/upload-profile-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to upload image");

      const imageUrl = `${BASE_URL}/${data.profile_image}?t=${Date.now()}`;
      setImageUri(imageUrl);

      const currentUser = await AsyncStorage.getItem("user");
      const updatedUser = {
        ...(JSON.parse(currentUser) || {}),
        profile_image: data.profile_image,
      };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      Alert.alert("Success", "Profile photo updated.");
    } catch (err) {
      console.error("Image upload error:", err);
      Alert.alert("Error", err.message || "Image upload failed.");
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile.");

      Alert.alert("Success", "Profile updated successfully.");
    } catch (err) {
      console.error("Update profile error:", err);
      Alert.alert("Error", err.message || "Could not update profile.");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#287778" />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>User Profile</Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.profileImage} />}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.smallButtonText}>Pick from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Text style={styles.smallButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={email}
        placeholder="Email"
        editable={false}
        style={[styles.input, { color: "#999" }]}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate("My Bids")}
        >
          <Text style={styles.smallButtonText}>My Bids</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={handleSave}>
          <Text style={styles.smallButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate("My Items")}
        >
          <Text style={styles.smallButtonText}>My Items</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
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
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    backgroundColor: "#ddd",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
  },
  smallButton: {
    flex: 1,
    backgroundColor: "#287778",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  imageButton: {
    flex: 1,
    backgroundColor: "#aaa",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});