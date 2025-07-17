import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const notifications = [
  {
    id: '1',
    type: 'outbid',
    title: 'You have been outbid',
    message: 'Make a counter-offer!\n24hrs remaining until deadline!',
    time: 'now',
  },
  {
    id: '2',
    type: 'won',
    title: 'Your bid has won',
    message: 'Get ready to grab your item!\nIf you are up for it, bid again for a different item!',
    time: 'now',
  },
];

export default function NotificationsScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.notification}>
      <View style={styles.iconRow}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor:
                item.type === 'outbid' ? '#2ecc71' : '#00bcd4',
            },
          ]}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.dotSeparator}>•</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
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