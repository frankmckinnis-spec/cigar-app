import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCigars, getJournalEntries, getPremiumMode } from '../utils/storage';

const DiscoverScreen = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadPremiumStatus();
    generateMockRecommendations();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const premium = await getPremiumMode();
      setIsPremium(premium);
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  };

  const generateMockRecommendations = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockRecommendations = [
        {
          id: 1,
          brand: 'Cohiba',
          name: 'Behike 52',
          reason: 'Based on your preference for full-bodied cigars with complex flavors',
          rating: 4.8,
          price: '$45',
          origin: 'Cuba',
          strength: 'Full',
          flavorProfile: 'Woody, Spicy, Earthy'
        },
        {
          id: 2,
          brand: 'Montecristo',
          name: 'No. 2',
          reason: 'Perfect for beginners, mild to medium strength with smooth draw',
          rating: 4.5,
          price: '$18',
          origin: 'Cuba',
          strength: 'Medium',
          flavorProfile: 'Creamy, Nutty, Sweet'
        },
        {
          id: 3,
          brand: 'Arturo Fuente',
          name: 'Opus X',
          reason: 'Premium Dominican cigar with exceptional construction and aging',
          rating: 4.9,
          price: '$35',
          origin: 'Dominican Republic',
          strength: 'Full',
          flavorProfile: 'Rich, Complex, Spicy'
        },
        {
          id: 4,
          brand: 'Padron',
          name: '1964 Anniversary',
          reason: 'Award-winning Nicaraguan cigar with consistent quality',
          rating: 4.7,
          price: '$28',
          origin: 'Nicaragua',
          strength: 'Medium-Full',
          flavorProfile: 'Chocolate, Coffee, Cedar'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 1500);
  };

  const handleGetRecommendations = () => {
    if (!isPremium) {
      Alert.alert(
        'Premium Feature',
        'AI-powered recommendations are available with Premium membership. Upgrade now to get personalized cigar suggestions!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => {/* Navigate to profile/premium */} }
        ]
      );
      return;
    }
    
    generateMockRecommendations();
  };

  const handleAddToHumidor = (cigar) => {
    Alert.alert(
      'Add to Humidor',
      `Would you like to add ${cigar.brand} ${cigar.name} to your humidor?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => {
            // In a real app, this would add to humidor
            Alert.alert('Success', 'Cigar added to your humidor!');
          }
        }
      ]
    );
  };

  const RecommendationCard = ({ recommendation }) => (
    <View style={styles.recommendationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cigarInfo}>
          <Text style={styles.brand}>{recommendation.brand}</Text>
          <Text style={styles.name}>{recommendation.name}</Text>
          <Text style={styles.origin}>{recommendation.origin}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{recommendation.rating}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.reason}>{recommendation.reason}</Text>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Strength:</Text>
            <Text style={styles.detailValue}>{recommendation.strength}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>{recommendation.price}</Text>
          </View>
        </View>

        <View style={styles.flavorProfile}>
          <Text style={styles.flavorLabel}>Flavor Profile:</Text>
          <Text style={styles.flavorText}>{recommendation.flavorProfile}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleAddToHumidor(recommendation)}
        >
          <Icon name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add to Humidor</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.infoButton}>
          <Icon name="info" size={20} color="#8B4513" />
          <Text style={styles.infoButtonText}>More Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Discover</Text>
        <Text style={styles.subtitle}>AI-Powered Recommendations</Text>
      </View>

      {!isPremium && (
        <View style={styles.premiumPrompt}>
          <Icon name="star" size={24} color="#FFD700" />
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Premium Feature</Text>
            <Text style={styles.premiumDescription}>
              Get personalized cigar recommendations powered by AI
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.refreshButton, !isPremium && styles.disabledButton]} 
        onPress={handleGetRecommendations}
        disabled={isLoading}
      >
        <Icon name="refresh" size={24} color="#fff" />
        <Text style={styles.refreshButtonText}>
          {isLoading ? 'Getting Recommendations...' : 'Get New Recommendations'}
        </Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Icon name="hourglass-empty" size={48} color="#8B4513" />
          <Text style={styles.loadingText}>Analyzing your preferences...</Text>
          <Text style={styles.loadingSubtext}>This may take a moment</Text>
        </View>
      ) : (
        <View style={styles.recommendationsContainer}>
          {recommendations.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="explore" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No recommendations yet</Text>
              <Text style={styles.emptyDescription}>
                {isPremium 
                  ? 'Tap the button above to get personalized recommendations'
                  : 'Upgrade to Premium to get AI-powered recommendations'
                }
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              {recommendations.map((recommendation) => (
                <RecommendationCard 
                  key={recommendation.id} 
                  recommendation={recommendation} 
                />
              ))}
            </>
          )}
        </View>
      )}

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Premium Features</Text>
        
        <View style={styles.featureItem}>
          <Icon name="psychology" size={24} color="#8B4513" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>AI Recommendations</Text>
            <Text style={styles.featureDescription}>
              Get personalized cigar suggestions based on your taste profile
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Icon name="trending-up" size={24} color="#8B4513" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Market Insights</Text>
            <Text style={styles.featureDescription}>
              Access to pricing trends and availability information
            </Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Icon name="group" size={24} color="#8B4513" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Community Access</Text>
            <Text style={styles.featureDescription}>
              Connect with other cigar enthusiasts and share experiences
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  premiumPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  premiumText: {
    marginLeft: 12,
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
  },
  premiumDescription: {
    fontSize: 14,
    color: '#856404',
    marginTop: 2,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 48,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  recommendationsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
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
  recommendationCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cigarInfo: {
    flex: 1,
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  name: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  origin: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardBody: {
    padding: 16,
  },
  reason: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  flavorProfile: {
    marginBottom: 16,
  },
  flavorLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  flavorText: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  infoButtonText: {
    color: '#8B4513',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  featuresSection: {
    padding: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
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
});

export default DiscoverScreen;
