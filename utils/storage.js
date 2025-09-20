import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  CIGARS: 'cigars',
  JOURNAL_ENTRIES: 'journal_entries',
  PREMIUM_MODE: 'premium_mode',
  FREE_HUMIDIFIER_CLAIMED: 'free_humidifier_claimed'
};

// Cigar storage functions
export const saveCigar = async (cigar) => {
  try {
    const existingCigars = await getCigars();
    const newCigar = {
      id: Date.now().toString(),
      ...cigar,
      addedDate: new Date().toISOString()
    };
    const updatedCigars = [...existingCigars, newCigar];
    await AsyncStorage.setItem(STORAGE_KEYS.CIGARS, JSON.stringify(updatedCigars));
    return newCigar;
  } catch (error) {
    console.error('Error saving cigar:', error);
    throw error;
  }
};

export const getCigars = async () => {
  try {
    const cigars = await AsyncStorage.getItem(STORAGE_KEYS.CIGARS);
    return cigars ? JSON.parse(cigars) : [];
  } catch (error) {
    console.error('Error getting cigars:', error);
    return [];
  }
};

export const removeCigar = async (cigarId) => {
  try {
    const existingCigars = await getCigars();
    const updatedCigars = existingCigars.filter(cigar => cigar.id !== cigarId);
    await AsyncStorage.setItem(STORAGE_KEYS.CIGARS, JSON.stringify(updatedCigars));
    return updatedCigars;
  } catch (error) {
    console.error('Error removing cigar:', error);
    throw error;
  }
};

// Journal storage functions
export const saveJournalEntry = async (entry) => {
  try {
    const existingEntries = await getJournalEntries();
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      date: new Date().toISOString()
    };
    const updatedEntries = [...existingEntries, newEntry];
    await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updatedEntries));
    return newEntry;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }
};

export const getJournalEntries = async () => {
  try {
    const entries = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error getting journal entries:', error);
    return [];
  }
};

// Premium mode functions
export const setPremiumMode = async (isPremium) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_MODE, JSON.stringify(isPremium));
    return isPremium;
  } catch (error) {
    console.error('Error setting premium mode:', error);
    throw error;
  }
};

export const getPremiumMode = async () => {
  try {
    const premiumMode = await AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_MODE);
    return premiumMode ? JSON.parse(premiumMode) : false;
  } catch (error) {
    console.error('Error getting premium mode:', error);
    return false;
  }
};

// Free humidifier functions
export const setFreeHumidifierClaimed = async (claimed) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FREE_HUMIDIFIER_CLAIMED, JSON.stringify(claimed));
    return claimed;
  } catch (error) {
    console.error('Error setting free humidifier status:', error);
    throw error;
  }
};

export const getFreeHumidifierClaimed = async () => {
  try {
    const claimed = await AsyncStorage.getItem(STORAGE_KEYS.FREE_HUMIDIFIER_CLAIMED);
    return claimed ? JSON.parse(claimed) : false;
  } catch (error) {
    console.error('Error getting free humidifier status:', error);
    return false;
  }
};

// Clear all data (for testing)
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
