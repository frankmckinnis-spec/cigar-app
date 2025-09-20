import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const JournalEntryForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [cigarName, setCigarName] = useState(initialData?.cigarName || '');
  const [rating, setRating] = useState(initialData?.rating?.toString() || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [flavors, setFlavors] = useState(initialData?.flavors || '');
  const [pairing, setPairing] = useState(initialData?.pairing || '');

  const handleSubmit = () => {
    if (!cigarName.trim()) {
      Alert.alert('Error', 'Please enter a cigar name');
      return;
    }

    if (rating && (isNaN(rating) || rating < 1 || rating > 5)) {
      Alert.alert('Error', 'Rating must be between 1 and 5');
      return;
    }

    const entry = {
      cigarName: cigarName.trim(),
      rating: rating ? parseFloat(rating) : null,
      notes: notes.trim(),
      flavors: flavors.trim(),
      pairing: pairing.trim(),
    };

    onSubmit(entry);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {initialData ? 'Edit Journal Entry' : 'New Journal Entry'}
        </Text>
        {onCancel && (
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cigar Name *</Text>
          <TextInput
            style={styles.input}
            value={cigarName}
            onChangeText={setCigarName}
            placeholder="Enter cigar name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rating (1-5)</Text>
          <TextInput
            style={styles.input}
            value={rating}
            onChangeText={setRating}
            placeholder="Enter rating (1-5)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tasting Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe the taste, aroma, and experience..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Flavors Detected</Text>
          <TextInput
            style={styles.input}
            value={flavors}
            onChangeText={setFlavors}
            placeholder="e.g., chocolate, coffee, cedar, spice"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pairing</Text>
          <TextInput
            style={styles.input}
            value={pairing}
            onChangeText={setPairing}
            placeholder="What did you pair it with? (whiskey, coffee, etc.)"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.buttonContainer}>
          {onCancel && (
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Icon name="save" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {initialData ? 'Update Entry' : 'Save Entry'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  cancelButton: {
    padding: 4,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default JournalEntryForm;
