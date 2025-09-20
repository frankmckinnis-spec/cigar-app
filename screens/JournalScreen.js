import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JournalEntryForm from '../components/JournalEntryForm';
import { getJournalEntries, saveJournalEntry, removeJournalEntry } from '../utils/storage';

const JournalScreen = () => {
  const [entries, setEntries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    loadEntries();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    try {
      const journalEntries = await getJournalEntries();
      setEntries(journalEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleAddEntry = () => {
    setEditingEntry(null);
    setShowAddForm(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowAddForm(true);
  };

  const handleRemoveEntry = (entryId) => {
    Alert.alert(
      'Remove Entry',
      'Are you sure you want to remove this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Note: removeJournalEntry function would need to be added to storage.js
              const updatedEntries = entries.filter(entry => entry.id !== entryId);
              setEntries(updatedEntries);
              // In a real app, you'd update AsyncStorage here
            } catch (error) {
              Alert.alert('Error', 'Failed to remove entry');
            }
          }
        }
      ]
    );
  };

  const handleSaveEntry = async (entryData) => {
    try {
      if (editingEntry) {
        // Update existing entry
        const updatedEntries = entries.map(entry => 
          entry.id === editingEntry.id 
            ? { ...entry, ...entryData }
            : entry
        );
        setEntries(updatedEntries);
      } else {
        // Add new entry
        const newEntry = await saveJournalEntry(entryData);
        setEntries([newEntry, ...entries]);
      }
      setShowAddForm(false);
      setEditingEntry(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save journal entry');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const JournalEntryCard = ({ entry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.cigarName}>{entry.cigarName}</Text>
        <View style={styles.entryActions}>
          <TouchableOpacity onPress={() => handleEditEntry(entry)}>
            <Icon name="edit" size={20} color="#8B4513" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleRemoveEntry(entry.id)}>
            <Icon name="delete" size={20} color="#DC143C" />
          </TouchableOpacity>
        </View>
      </View>

      {entry.rating && (
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{entry.rating}/5</Text>
        </View>
      )}

      {entry.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Tasting Notes:</Text>
          <Text style={styles.notesText}>{entry.notes}</Text>
        </View>
      )}

      {entry.flavors && (
        <View style={styles.flavorsContainer}>
          <Text style={styles.flavorsLabel}>Flavors:</Text>
          <Text style={styles.flavorsText}>{entry.flavors}</Text>
        </View>
      )}

      {entry.pairing && (
        <View style={styles.pairingContainer}>
          <Text style={styles.pairingLabel}>Pairing:</Text>
          <Text style={styles.pairingText}>{entry.pairing}</Text>
        </View>
      )}

      <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tasting Journal</Text>
        <Text style={styles.countText}>{entries.length} entries</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>New Entry</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="book" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No journal entries yet</Text>
            <Text style={styles.emptyDescription}>
              Start documenting your cigar experiences
            </Text>
          </View>
        ) : (
          entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))
        )}
      </ScrollView>

      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <JournalEntryForm
          onSubmit={handleSaveEntry}
          onCancel={() => setShowAddForm(false)}
          initialData={editingEntry}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  countText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E8B57',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  entryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cigarName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    flex: 1,
  },
  entryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notesContainer: {
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  flavorsContainer: {
    marginBottom: 12,
  },
  flavorsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  flavorsText: {
    fontSize: 14,
    color: '#666',
  },
  pairingContainer: {
    marginBottom: 12,
  },
  pairingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pairingText: {
    fontSize: 14,
    color: '#666',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
});

export default JournalScreen;
