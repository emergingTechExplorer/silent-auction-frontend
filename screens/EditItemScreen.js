import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

const mockItem = {
  id: '1',
  title: 'Antique Vase',
  description: 'A beautiful vintage vase in excellent condition.',
  startingBid: '100',
  category: 'Art',
  deadline: '2025-07-20',
};

export default function EditItemScreen({ route, navigation }) {
  const { itemId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    // Load item data — mock version
    setTitle(mockItem.title);
    setDescription(mockItem.description);
    setStartingBid(mockItem.startingBid);
    setCategory(mockItem.category);
    setDeadline(mockItem.deadline);
  }, [itemId]);

  const handleSave = () => {
    if (!title || !description || !startingBid || !category || !deadline) {
      Alert.alert('Error', 'All fields are required');
    } else {
      Alert.alert('Saved', 'Item details updated!');
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Item</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, { height: 100 }]}
      />
      <TextInput
        placeholder="Starting Bid"
        value={startingBid}
        onChangeText={setStartingBid}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <TextInput
        placeholder="Deadline (YYYY-MM-DD)"
        value={deadline}
        onChangeText={setDeadline}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#287778',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#287778',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});