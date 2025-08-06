import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.242.34:5000'; // Replace with your IP

export default function MyBidsScreen({ navigation }) {
  const [bids, setBids] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMyBids = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/bids/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch bids');

      setBids(data);
    } catch (err) {
      console.error('Error fetching my bids:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyBids();
    }, [])
  );

  // Countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};

      bids.forEach((bid) => {
        const deadline = new Date(bid.item_id.deadline).getTime();
        const now = Date.now();
        const diff = deadline - now;

        if (diff <= 0) {
          newCountdowns[bid._id] = "Ended";
        } else {
          const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
          const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
          const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

          newCountdowns[bid._id] = `${hours}:${minutes}:${seconds}`;
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [bids]);

  const renderItem = ({ item }) => {
    const itemData = item.item_id;
    const image = itemData.images?.[0];
    const deadlineFormatted = new Date(itemData.deadline).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const countdown = countdowns[item._id];
    const ended = countdown === "Ended";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ItemDetails', { item: itemData })}
      >
        <View style={styles.row}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{itemData.title}</Text>
            <Text style={styles.bid}>Your Bid: ${item.bid_amount}</Text>
            <Text style={styles.deadline}>Deadline: {deadlineFormatted}</Text>
            <Text style={[styles.countdown, ended && styles.ended]}>
              {ended ? "⛔ Ended" : `⏳ Time Left: ${countdown}`}
            </Text>
          </View>
        </View>
        <Text style={[styles.status, { color: ended ? 'red' : 'green' }]}>
          {ended ? 'Ended' : 'Active'}
        </Text>
        <View style={styles.divider} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#287778" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Bids</Text>
      <FlatList
        data={bids}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  bid: {
    fontSize: 15,
    color: '#333',
  },
  deadline: {
    fontSize: 14,
    color: '#555',
  },
  countdown: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#287778",
    marginTop: 2,
  },
  ended: {
    color: "red",
  },
  status: {
    textAlign: 'right',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 12,
  },
});