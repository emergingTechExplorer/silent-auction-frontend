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
import { getDigitalCountdown } from "../utils/time";
import { fetchBidsForItem, placeBidForItem, getImageUrl } from "../utils/api";

export default function ItemDetailsScreen({ route }) {
  const item = route?.params?.item;
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [countdown, setCountdown] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: Item not found.</Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const data = await fetchBidsForItem(item._id, token);
        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setBids(sorted);

        const user = JSON.parse(await AsyncStorage.getItem("user"));
        const itemOwnerId = item.user_id?._id || item.user_id;
        setIsOwner(user._id === itemOwnerId);
      } catch (err) {
        console.error("Error fetching bids or user:", err.message);
      }
    };

    fetchInitialData();
  }, [item._id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const result = getDigitalCountdown(item.deadline);
      setCountdown(result);
      if (result === "Ended") clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [item.deadline]);

  const placeBid = async () => {
    if (!bidAmount) {
      Alert.alert("Error", "Enter a bid amount");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const data = await placeBidForItem(item._id, bidAmount, token);

      Alert.alert("Success", `Your bid of $${bidAmount} was placed`);
      setBidAmount("");
      setBids((prev) => [
        { ...data, created_at: new Date().toISOString(), user_id: user },
        ...prev,
      ]);
    } catch (err) {
      Alert.alert(
        "Error",
        err.message || "Something went wrong while placing your bid"
      );
    }
  };

  const hasEnded = countdown === "Ended";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{item.title}</Text>

      <Image
        source={{ uri: getImageUrl(item.images?.[0]) }}
        style={styles.image}
      />

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

      <Text style={[styles.timer, hasEnded && { color: "red" }]}>
        {hasEnded ? "⛔ Auction Ended" : `⏳ Time Left: ${countdown}`}
      </Text>

      <Text style={styles.sectionTitle}>Bid History</Text>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>Bidder</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Time</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Amount</Text>
        </View>

        {bids.length > 0 ? (
          bids.map((bid) => (
            <View key={bid._id} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {bid.user_id?.name || "Anonymous"}
              </Text>
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

      {isOwner ? (
        <Text style={styles.ownerNote}>
          🚫 You cannot bid on your own item.
        </Text>
      ) : hasEnded ? (
        <Text style={styles.ownerNote}>⏱ Auction has ended.</Text>
      ) : (
        <>
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
        </>
      )}
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
  ownerNote: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginVertical: 12,
  },
});
