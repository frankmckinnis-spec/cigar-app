import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CigarCard from '../components/CigarCard';
import { getCigars, saveCigar, removeCigar } from '../utils/storage';

const HumidorScreen = () => {
  const [cigars, setCigars] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCigar, setEditingCigar] = useState(null);

  useEffect(() => {
    loadCigars();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCigars();
    }, [])
  );

  const loadCigars = async () => {
    try {
      const cigarList = await getCigars();
      setCigars(cigarList);
    } catch (error) {
      console.error('Error loading cigars:', error);
    }
  };

  const handleAddCigar = () => {
    setEditingCigar(null);
    setShowAddForm(true);
  };

  const handleEditCigar = (cigar) => {
    setEditingCigar(cigar);
    setShowAddForm(true);
  };

  const handleRemoveCigar = (cigarId) => {
    Alert.alert(
      'Remove Cigar',
      'Are you sure you want to remove this cigar from your humidor?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeCigar(cigarId);
              loadCigars();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove cigar');
            }
          }
        }
      ]
    );
  };

  const handleSaveCigar = async (cigarData) => {
    try {
      if (editingCigar) {
        // Update existing cigar
        const updatedCigars = cigars.map(cigar => 
          cigar.id === editingCigar.id 
            ? { ...cigar, ...cigarData }
            : cigar
        );
        setCigars(updatedCigars);
        // Note: In a real app, you'd want to update AsyncStorage here too
      } else {
        // Add new cigar
        await saveCigar(cigarData);
        loadCigars();
      }
      setShowAddForm(false);
      setEditingCigar(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save cigar');
    }
  };

  const AddCigarForm = () => {
    const [brand, setBrand] = useState(editingCigar?.brand || '');
    const [name, setName] = useState(editingCigar?.name || '');
    const [size, setSize] = useState(editingCigar?.size || '');
    const [origin, setOrigin] = useState(editingCigar?.origin || '');
    const [rating, setRating] = useState(editingCigar?.rating?.toString() || '');
    const [imageUri, setImageUri] = useState(editingCigar?.imageUri || null);

    const pickImage = async () => {
      try {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant camera roll permissions to add photos.');
          return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          setImageUri(result.assets[0].uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to pick image');
      }
    };

    const takePhoto = async () => {
      try {
        // Request permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
          return;
        }

        // Launch camera
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          setImageUri(result.assets[0].uri);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      }
    };

    const showImageOptions = () => {
      Alert.alert(
        'Add Photo',
        'Choose how you want to add a photo',
        [
          { text: 'Camera', onPress: takePhoto },
          { text: 'Photo Library', onPress: pickImage },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    };

    const removeImage = () => {
      setImageUri(null);
    };

    const handleSubmit = () => {
      if (!brand.trim() || !name.trim()) {
        Alert.alert('Error', 'Please enter brand and name');
        return;
      }

      const cigarData = {
        brand: brand.trim(),
        name: name.trim(),
        size: size.trim(),
        origin: origin.trim(),
        rating: rating ? parseFloat(rating) : null,
        imageUri: imageUri,
      };

      handleSaveCigar(cigarData);
    };

    return (
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {editingCigar ? 'Edit Cigar' : 'Add New Cigar'}
          </Text>
          <TouchableOpacity onPress={() => setShowAddForm(false)}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Brand *</Text>
            <TextInput
              style={styles.input}
              value={brand}
              onChangeText={setBrand}
              placeholder="e.g., Cohiba, Montecristo"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Behike 52, No. 2"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Size</Text>
            <TextInput
              style={styles.input}
              value={size}
              onChangeText={setSize}
              placeholder="e.g., Robusto, Toro, Churchill"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Origin</Text>
            <TextInput
              style={styles.input}
              value={origin}
              onChangeText={setOrigin}
              placeholder="e.g., Cuba, Dominican Republic"
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
            <Text style={styles.label}>Photo (Optional)</Text>
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <Icon name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addPhotoButton} onPress={showImageOptions}>
                <Icon name="add-a-photo" size={24} color="#8B4513" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Icon name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>
              {editingCigar ? 'Update Cigar' : 'Add to Humidor'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Humidor</Text>
        <Text style={styles.countText}>{cigars.length} cigars</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddCigar}>
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Cigar</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content}>
        {cigars.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="inventory" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Your humidor is empty</Text>
            <Text style={styles.emptyDescription}>
              Add your first cigar to start building your collection
            </Text>
          </View>
        ) : (
          cigars.map((cigar) => (
            <CigarCard
              key={cigar.id}
              cigar={cigar}
              onEdit={handleEditCigar}
              onRemove={handleRemoveCigar}
            />
          ))
        )}
      </ScrollView>

      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddCigarForm />
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
    backgroundColor: '#8B4513',
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
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  form: {
    flex: 1,
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8B4513',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  addPhotoText: {
    color: '#8B4513',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HumidorScreen;
