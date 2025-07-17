import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

export default function ItemDetailsScreen({ route }) {
  const { item } = route.params;
  const [bidAmount, setBidAmount] = useState('');

  const mockBidHistory = [
    { id: '1', date: '28/06/2025', amount: '5' },
    { id: '2', date: '02/07/2025', amount: '10' },
    { id: '3', date: '12/08/2025', amount: '15' },
  ];

  const placeBid = () => {
    if (!bidAmount) {
      Alert.alert('Enter a bid amount');
      return;
    }
    Alert.alert('Bid placed', `Your bid of $${bidAmount} has been submitted.`);
    setBidAmount('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{item.title}</Text>

      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.description}>This {item.title.toLowerCase()} is 100 years old</Text>

      <Text style={styles.sectionTitle}>Bid History</Text>

      {/* Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, styles.headerText]}>Date</Text>
          <Text style={[styles.tableCell, styles.headerText]}>Bid Amount ($)</Text>
        </View>

        {mockBidHistory.map((bid) => (
          <View key={bid.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{bid.date}</Text>
            <Text style={styles.tableCell}>${bid.amount}</Text>
          </View>
        ))}
      </View>

      {/* Input + Button */}
      <TextInput
        placeholder="Bid amount"
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
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 14,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#287778',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});