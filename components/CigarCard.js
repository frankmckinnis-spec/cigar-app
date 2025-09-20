import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CigarCard = ({ cigar, onRemove, onEdit }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.card}>
      {cigar.imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: cigar.imageUri }} style={styles.cigarImage} />
        </View>
      )}
      <View style={styles.cardHeader}>
        <Text style={styles.brand}>{cigar.brand}</Text>
        <Text style={styles.name}>{cigar.name}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.detailRow}>
          <Icon name="straighten" size={16} color="#666" />
          <Text style={styles.detailText}>{cigar.size}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="flag" size={16} color="#666" />
          <Text style={styles.detailText}>{cigar.origin}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Icon name="calendar-today" size={16} color="#666" />
          <Text style={styles.detailText}>Added: {formatDate(cigar.addedDate)}</Text>
        </View>
        
        {cigar.rating && (
          <View style={styles.detailRow}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.detailText}>{cigar.rating}/5</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(cigar)}>
          <Icon name="edit" size={20} color="#8B4513" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(cigar.id)}>
          <Icon name="delete" size={20} color="#DC143C" />
          <Text style={[styles.buttonText, { color: '#DC143C' }]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  name: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  cardBody: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  buttonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#8B4513',
    fontWeight: '500',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    marginBottom: 12,
  },
  cigarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
});

export default CigarCard;
