import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCigars, getJournalEntries, getPremiumMode } from '../utils/storage';

const HomeScreen = ({ navigation }) => {
  const [cigarCount, setCigarCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const cigars = await getCigars();
      const entries = await getJournalEntries();
      const premium = await getPremiumMode();
      
      setCigarCount(cigars.length);
      setJournalCount(entries.length);
      setIsPremium(premium);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleQuickAdd = () => {
    Alert.alert(
      'Quick Add',
      'What would you like to add?',
      [
        { text: 'Cigar to Humidor', onPress: () => navigation.navigate('Humidor') },
        { text: 'Journal Entry', onPress: () => navigation.navigate('Journal') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statContent}>
        <Icon name={icon} size={32} color={color} />
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appTitle}>Ultimate Cigar Companion</Text>
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        )}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.quickAddButton} onPress={handleQuickAdd}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.quickAddText}>Quick Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Collection</Text>
        
        <StatCard
          title="Cigars in Humidor"
          value={cigarCount}
          icon="inventory"
          color="#8B4513"
          onPress={() => navigation.navigate('Humidor')}
        />
        
        <StatCard
          title="Journal Entries"
          value={journalCount}
          icon="book"
          color="#2E8B57"
          onPress={() => navigation.navigate('Journal')}
        />
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Features</Text>
        
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('Discover')}
        >
          <Icon name="explore" size={24} color="#8B4513" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Discover</Text>
            <Text style={styles.featureDescription}>Get AI-powered cigar recommendations</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="settings" size={24} color="#8B4513" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Settings & Premium</Text>
            <Text style={styles.featureDescription}>Manage your account and upgrade</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      {isPremium && (
        <View style={styles.premiumSection}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>
          <View style={styles.benefitCard}>
            <Icon name="local-shipping" size={24} color="#FFD700" />
            <Text style={styles.benefitText}>Free Humidifier Claimed: YES</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#8B4513',
    padding: 24,
    alignItems: 'center',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  appTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    padding: 16,
    borderRadius: 12,
  },
  quickAddText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsSection: {
    padding: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  featuresSection: {
    padding: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureText: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  premiumSection: {
    padding: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  benefitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
});

export default HomeScreen;
