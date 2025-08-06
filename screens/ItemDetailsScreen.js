import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ItemDetailsScreen({ route }) {
  const item = route?.params?.item;
  const BASE_URL = "http://192.168.242.34:5000"; // adjust if needed

  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [countdown, setCountdown] = useState("");

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: Item not found.</Text>
      </View>
    );
  }

  // Fetch bids
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/bids/item/${item._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch bids");
        const data = await res.json();
        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setBids(sorted);
      } catch (err) {
        console.error("Error fetching bids:", err.message);
      }
    };

    fetchBids();
  }, [item._id]);

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadlineTime = new Date(item.deadline).getTime();
      const diff = deadlineTime - now;

      if (diff <= 0) {
        setCountdown("Ended");
        clearInterval(interval);
        return;
      }

      const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
      const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      setCountdown(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [item.deadline]);

  // Submit bid
  const placeBid = async () => {
    if (!bidAmount) {
      Alert.alert("Error", "Enter a bid amount");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: item._id,
          bid_amount: parseFloat(bidAmount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Bid Failed", data.message || "Something went wrong");
        return;
      }

      Alert.alert("Success", `Your bid of $${bidAmount} was placed`);
      setBidAmount("");
      setBids((prev) => [
        { ...data, created_at: new Date().toISOString() },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error placing bid:", err.message);
      Alert.alert("Error", "Something went wrong while placing your bid");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{item.title}</Text>

      <Image source={{ uri: item.images[0] }} style={styles.image} />

      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.description}>Starting Bid: ${item.starting_bid}</Text>
      <Text style={styles.description}>
        Deadline:{" "}
        {new Date(item.deadline).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      <Text
        style={[
          styles.timer,
          countdown === "Ended" && { color: "red" },
        ]}
      >
        {countdown === "Ended" ? "⛔ Auction Ended" : `⏳ Time Left: ${countdown}`}
      </Text>

      <Text style={styles.sectionTitle}>Bid History</Text>

      {/* Updated Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>Date & Time</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Bid ($)</Text>
        </View>

        {bids.length > 0 ? (
          bids.map((bid) => (
            <View key={bid._id} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {new Date(bid.bid_time).toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text style={styles.tableCell}>${bid.bid_amount}</Text>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>No bids yet</Text>
          </View>
        )}
      </View>

      {/* Input + Button */}
      <TextInput
        placeholder="Your bid amount"
        value={bidAmount}
        onChangeText={setBidAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={placeBid} style={styles.button}>
        <Text style={styles.buttonText}>Place Bid</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: "cover",
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  timer: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#287778",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    textAlign: "center",
  },
  headerText: {
    fontWeight: "bold",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#287778",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});