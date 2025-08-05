import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.242.34:5000';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to load notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Fetch notifications error:', err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notification}>
      <View style={styles.iconRow}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: item.type === 'outbid' ? '#2ecc71' : '#00bcd4',
            },
          ]}
        />
        <Text style={styles.title}>
          {item.type === 'won' ? 'Your bid has won' : 'You have been outbid'}
        </Text>
        <Text style={styles.dotSeparator}>•</Text>
        <Text style={styles.time}>
          {new Date(item.created_at).toLocaleTimeString()}
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
        ListEmptyComponent={<Text>No notifications found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  notification: {
    marginBottom: 24,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#999',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  time: {
    fontSize: 13,
    color: '#777',
  },
  message: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});