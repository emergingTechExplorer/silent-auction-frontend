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
import {
  fetchUserProfile,
  updateProfileImage,
  updateUserProfile,
} from "../utils/api";

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUserId(userData._id);
        setName(userData.name || "");
        setEmail(userData.email || "");

        if (userData.profile_image) {
          setImageUri(userData.profile_image);
        }
      } catch (err) {
        Alert.alert("Error", err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const chooseImage = async (source) => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Camera or Gallery access is needed.");
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });

    if (!result.canceled && result.assets.length > 0) {
      try {
        const uri = result.assets[0].uri;
        const updatedImageUri = await updateProfileImage(userId, uri);
        setImageUri(updatedImageUri);
        Alert.alert("Success", "Profile photo updated.");
      } catch (err) {
        Alert.alert("Error", err.message);
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(userId, { name });
      Alert.alert("Success", "Profile updated.");
    } catch (err) {
      Alert.alert("Error", err.message);
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
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => chooseImage("gallery")}
        >
          <Text style={styles.smallButtonText}>Pick from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => chooseImage("camera")}
        >
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
        <TouchableOpacity style={styles.smallButton} onPress={handleUpdateProfile}>
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