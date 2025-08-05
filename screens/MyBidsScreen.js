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

const BASE_URL = 'http://192.168.242.34:5000'; // replace with your IP

export default function MyBidsScreen({ navigation }) {
  const [bids, setBids] = useState([]);
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

  const renderItem = ({ item }) => {
    const itemData = item.item_id;
    const image = itemData.images?.[0];
    const deadline = new Date(itemData.deadline).toLocaleDateString();
    const ended = new Date(itemData.deadline) < new Date();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ItemDetails', { item: itemData })}
      >
        <View style={styles.row}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{itemData.title}</Text>
            <Text style={styles.bid}>Current Bid: ${item.bid_amount}</Text>
            <Text style={styles.deadline}>Deadline: {deadline}</Text>
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
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60,
    paddingHorizontal: 20, },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: { marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  image: {
    width: 100, height: 100, borderRadius: 6, marginRight: 12,
    backgroundColor: '#eee'
  },
  textContainer: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  bid: { fontSize: 15, color: '#333' },
  deadline: { fontSize: 14, color: '#555' },
  status: {
    textAlign: 'right',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
  },
  divider: { height: 1, backgroundColor: '#ccc', marginTop: 12 },
});