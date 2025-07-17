import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const mockBids = [
  {
    id: '1',
    title: 'Vase',
    image: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    highestBid: '$8',
    auctionEnded: false,
  },
  {
    id: '2',
    title: 'Pen',
    image: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    highestBid: '$8',
    auctionEnded: true,
  },
];

export default function MyBidsScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ItemDetails', {
          item: {
            title: item.title,
            image: item.image,
            price: item.highestBid,
          },
        })
      }
    >
      <View style={styles.row}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.bid}>Current Highest Bid: {item.highestBid}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.status,
          { color: item.auctionEnded ? 'red' : 'green' },
        ]}
      >
        {item.auctionEnded ? 'Ended' : 'Active'}
      </Text>
      <View style={styles.divider} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Bids</Text>
      <FlatList
        data={mockBids}
        keyExtractor={(item) => item.id}
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
    padding: 16,
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