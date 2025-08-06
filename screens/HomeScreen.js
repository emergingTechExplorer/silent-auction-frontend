import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "http://192.168.242.34:5000";

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dropdown states
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [statusOptions, setStatusOptions] = useState([
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Ended", value: "ended" },
  ]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/items`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFilteredItems((prev) => [...prev]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = [...items];

    if (filterStatus === "active") {
      result = result.filter((item) => new Date(item.deadline) > new Date());
    } else if (filterStatus === "ended") {
      result = result.filter((item) => new Date(item.deadline) <= new Date());
    }

    if (searchQuery.trim()) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(result);
  }, [items, searchQuery, filterStatus]);

  const getCountdown = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${mins}m ${secs}s`;
  };

  const renderItem = ({ item }) => {
    const deadlineFormatted = new Date(item.deadline).toLocaleString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );

    const countdown = getCountdown(item.deadline);
    const isEnded = countdown === "Ended";

    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => navigation.navigate("ItemDetails", { item })}
      >
        <Image source={{ uri: item.images?.[0] }} style={styles.image} />
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>Starting at ${item.starting_bid}</Text>
        <Text style={styles.deadlineText}>Ends: {deadlineFormatted}</Text>
        <Text
          style={[styles.countdown, { color: isEnded ? "#888" : "#d9534f" }]}
        >
          {isEnded ? "⛔ Ended" : `⏳ ${countdown}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Auctions</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <DropDownPicker
          open={open}
          value={filterStatus}
          items={statusOptions}
          setOpen={setOpen}
          setValue={setFilterStatus}
          setItems={setStatusOptions}
          style={styles.dropdown}
          textStyle={{ fontSize: 14 }}
          dropDownDirection="BOTTOM"
          containerStyle={{ width: 130 }}
          zIndex={1000}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#287778" />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={styles.grid}
        />
      )}

      <Text style={styles.subText}>Can’t Find Your Interest?</Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation.navigate("Upload")}
      >
        <Text style={styles.uploadText}>Upload Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    zIndex: 1000, // for DropDownPicker
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 10,
    height: 40,
  },
  grid: {
    gap: 16,
    paddingBottom: 20,
  },
  itemCard: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: "cover",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 14,
    color: "#444",
  },
  uploadButton: {
    backgroundColor: "#287778",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  deadlineText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    textAlign: "center",
  },
  countdown: {
    fontSize: 12,
    color: "#d9534f",
    textAlign: "center",
    marginTop: 2,
    fontWeight: "bold",
  },
});
