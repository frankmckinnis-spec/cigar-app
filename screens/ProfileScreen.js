import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getPremiumMode, setPremiumMode, getFreeHumidifierClaimed, setFreeHumidifierClaimed, clearAllData } from '../utils/storage';

const ProfileScreen = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [freeHumidifierClaimed, setFreeHumidifierClaimedState] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const premium = await getPremiumMode();
      const humidifierClaimed = await getFreeHumidifierClaimed();
      setIsPremium(premium);
      setFreeHumidifierClaimedState(humidifierClaimed);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handlePremiumToggle = async (value) => {
    try {
      await setPremiumMode(value);
      setIsPremium(value);
      
      if (value) {
        Alert.alert(
          'Premium Activated!',
          'Welcome to Premium! You now have access to AI recommendations and all premium features.',
          [{ text: 'Awesome!', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update premium status');
    }
  };

  const handleHumidifierClaim = async () => {
    if (!isPremium) {
      Alert.alert(
        'Premium Required',
        'You need Premium membership to claim the free humidifier.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Claim Free Humidifier',
      'Congratulations! You can now claim your free premium humidifier. This is a mock feature for the MVP.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Claim Now', 
          onPress: async () => {
            try {
              await setFreeHumidifierClaimed(true);
              setFreeHumidifierClaimedState(true);
              Alert.alert('Success!', 'Your free humidifier has been claimed!');
            } catch (error) {
              Alert.alert('Error', 'Failed to claim humidifier');
            }
          }
        }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all your cigars, journal entries, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              setIsPremium(false);
              setFreeHumidifierClaimedState(false);
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, description, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#8B4513" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
      </View>
      {rightComponent || <Icon name="chevron-right" size={24} color="#ccc" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Icon name="person" size={32} color="#fff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Cigar Enthusiast</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
        </View>
        
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <SettingItem
          icon="person"
          title="Profile Information"
          description="Update your personal details"
          onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available in a future update')}
        />
        
        <SettingItem
          icon="notifications"
          title="Notifications"
          description="Manage your notification preferences"
          onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available in a future update')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="star" size={24} color="#8B4513" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Premium Mode</Text>
              <Text style={styles.settingDescription}>
                {isPremium ? 'Access to all premium features' : 'Unlock AI recommendations and more'}
              </Text>
            </View>
          </View>
          <Switch
            value={isPremium}
            onValueChange={handlePremiumToggle}
            trackColor={{ false: '#ccc', true: '#8B4513' }}
            thumbColor={isPremium ? '#fff' : '#f4f3f4'}
          />
        </View>

        {isPremium && (
          <SettingItem
            icon="local-shipping"
            title="Free Humidifier"
            description={freeHumidifierClaimed ? 'Claimed ✓' : 'Available to claim'}
            onPress={freeHumidifierClaimed ? null : handleHumidifierClaim}
            rightComponent={
              freeHumidifierClaimed ? (
                <Icon name="check-circle" size={24} color="#4CAF50" />
              ) : (
                <Icon name="chevron-right" size={24} color="#ccc" />
              )
            }
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        
        <SettingItem
          icon="help"
          title="Help & Support"
          description="Get help and contact support"
          onPress={() => Alert.alert('Help', 'For support, please contact us at support@cigarcompanion.com')}
        />
        
        <SettingItem
          icon="info"
          title="About"
          description="App version and information"
          onPress={() => Alert.alert('About', 'Ultimate Cigar Companion v1.0.0\nBuilt with React Native and Expo')}
        />
        
        <SettingItem
          icon="delete"
          title="Clear All Data"
          description="Remove all app data (for testing)"
          onPress={handleClearData}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium Benefits</Text>
        
        <View style={styles.benefitItem}>
          <Icon name="psychology" size={20} color="#8B4513" />
          <Text style={styles.benefitText}>AI-Powered Recommendations</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Icon name="trending-up" size={20} color="#8B4513" />
          <Text style={styles.benefitText}>Market Insights & Pricing</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Icon name="group" size={20} color="#8B4513" />
          <Text style={styles.benefitText}>Community Access</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Icon name="local-shipping" size={20} color="#8B4513" />
          <Text style={styles.benefitText}>Free Premium Humidifier</Text>
        </View>
        
        <View style={styles.benefitItem}>
          <Icon name="backup" size={20} color="#8B4513" />
          <Text style={styles.benefitText}>Cloud Backup & Sync</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ultimate Cigar Companion</Text>
        <Text style={styles.footerVersion}>Version 1.0.0</Text>
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
    backgroundColor: '#8B4513',
    padding: 24,
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 16,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 1,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footerVersion: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ProfileScreen;
