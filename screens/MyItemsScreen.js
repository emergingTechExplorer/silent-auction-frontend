import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.242.34:5000"; // Replace with your IP

export default function MyItemsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyItems = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/items/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setItems(data);
      } else {
        console.error("Failed to fetch items:", data.message);
      }
    } catch (err) {
      console.error("Error fetching uploaded items:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyItems();
    }, [])
  );

  const renderItem = ({ item }) => {
    const highestBid =
      item.bids && item.bids.length > 0
        ? Math.max(...item.bids.map((b) => b.bid_amount))
        : "No bids";

    const deadlineDate = new Date(item.deadline);
    const deadlineFormatted = deadlineDate.toLocaleDateString();
    const hasEnded = deadlineDate < new Date();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ItemDetails", { item })}
      >
        <View style={styles.row}>
          <Image
            source={{
              uri: item.images[0] || "https://via.placeholder.com/100",
            }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.bid}>
              Current Highest Bid:{" "}
              {highestBid !== "No bids" ? `$${highestBid}` : highestBid}
            </Text>
            <Text style={styles.deadline}>Deadline: {deadlineFormatted}</Text>
          </View>
        </View>
        <Text style={[styles.status, { color: hasEnded ? "red" : "green" }]}>
          {hasEnded ? "Ended" : "Active"}
        </Text>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Uploaded Items</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#287778"
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 30 }}>
              You haven't uploaded any items yet.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  bid: {
    fontSize: 15,
    color: "#333",
  },
  deadline: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  status: {
    textAlign: "right",
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 12,
  },
});