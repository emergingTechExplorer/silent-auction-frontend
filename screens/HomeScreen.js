import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockItems = [
  {
    id: '1',
    title: 'Cup',
    price: '$5',
    image: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
,
  },
  {
    id: '2',
    title: 'Bottle',
    price: '$10',
    image: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
,
  },
  {
    id: '3',
    title: 'Vase',
    price: '$5',
    image: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: '4',
    title: 'Pen',
    price: '$8',
    image: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export default function HomeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Auctions</Text>

      <View style={styles.searchContainer}>
        <TextInput placeholder="Search" style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.grid}
      />

      <Text style={styles.subText}>Can’t Find Your Interest?</Text>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.uploadText}>Upload Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    gap: 16,
    paddingBottom: 20,
  },
  itemCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1, // Square image
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
  },
  subText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#444',
  },
  uploadButton: {
    backgroundColor: '#287778',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});