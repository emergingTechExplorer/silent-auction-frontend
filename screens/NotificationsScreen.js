import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { fetchNotifications } from "../utils/api";
import { useFocusEffect } from "@react-navigation/native";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadNotifications = async () => {
        setLoading(true); // Add this to ensure loading is reset on focus
        try {
          const data = await fetchNotifications();
          setNotifications(data);
        } catch (err) {
          console.error("Error loading notifications:", err.message);
        } finally {
          setLoading(false); // ✅ This is critical
        }
      };
      loadNotifications();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.notification}>
      <View style={styles.iconRow}>
        <View
          style={[
            styles.dot,
            { backgroundColor: item.type === "outbid" ? "#2ecc71" : "#00bcd4" },
          ]}
        />
        <Text style={styles.title}>
          {item.type === "won" ? "Your bid has won" : "You have been outbid"}
        </Text>
        <Text style={styles.dotSeparator}>•</Text>
        <Text style={styles.time}>
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#287778" />
        <Text style={{ marginTop: 10 }}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#666" }}>
            No notifications found.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  notification: {
    marginBottom: 24,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: "#999",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },
  time: {
    fontSize: 13,
    color: "#777",
  },
  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
