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
import { getCountdown } from "../utils/time";
import { fetchMyUploadedItems } from "../utils/api";

export default function MyItemsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      const data = await fetchMyUploadedItems();
      setItems(data);
    } catch (err) {
      console.error("Error fetching uploaded items:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadItems();
  }, []));

  // Live countdown refresh every second
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => [...prev]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }) => {
    const highestBid =
      item.bids && item.bids.length > 0
        ? Math.max(...item.bids.map((b) => b.bid_amount))
        : "No bids";

    const deadlineFormatted = new Date(item.deadline).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const countdown = getCountdown(item.deadline);
    const hasEnded = countdown === "Ended";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ItemDetails", { item })}
      >
        <View style={styles.row}>
          <Image
            source={{ uri: item.images[0] || "https://via.placeholder.com/100" }}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.bid}>
              Current Highest Bid: {highestBid !== "No bids" ? `$${highestBid}` : highestBid}
            </Text>
            <Text style={styles.deadline}>Deadline: {deadlineFormatted}</Text>
            <Text style={[styles.countdown, { color: hasEnded ? "red" : "#287778" }]}>
              {hasEnded ? "⛔ Auction Ended" : `⏳ Time Left: ${countdown}`}
            </Text>
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
        <ActivityIndicator size="large" color="#287778" style={{ marginTop: 30 }} />
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
  countdown: {
    fontSize: 14,
    fontWeight: "600",
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