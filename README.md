# Ultimate Cigar Companion

A React Native mobile app built with Expo for cigar enthusiasts to track their humidor, maintain a tasting journal, and discover new cigars with AI-powered recommendations.

## 🚀 Features

### Core Features
- **Humidor Management**: Add, edit, and remove cigars from your personal collection
- **Tasting Journal**: Document your cigar experiences with detailed notes, ratings, and flavor profiles
- **AI Recommendations**: Get personalized cigar suggestions (Premium feature)
- **Premium Mode**: Unlock advanced features and claim a free humidifier
- **Local Storage**: All data stored locally using AsyncStorage

### Screens
- **Home**: Dashboard with quick stats and actions
- **Humidor**: Manage your cigar collection
- **Journal**: Record and review tasting experiences
- **Discover**: AI-powered recommendations and premium features
- **Profile**: Settings, premium management, and app information

## 🛠️ Tech Stack

- **React Native** with Expo (Managed Workflow)
- **React Navigation** (Bottom Tabs)
- **AsyncStorage** for local data persistence
- **React Native Vector Icons** for UI icons
- **NativeWind** for styling (Tailwind CSS for React Native)

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd ultimate-cigar-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   expo start
   ```

4. **Run on device**
   - Install Expo Go on your iOS/Android device
   - Scan the QR code displayed in your terminal/browser
   - The app will load on your device

### Alternative Run Commands
```bash
# Run on iOS simulator
expo start --ios

# Run on Android emulator
expo start --android

# Run in web browser
expo start --web
```

## 📁 Project Structure

```
UltimateCigarApp/
├── App.js                 # Main app component with navigation
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration for NativeWind
├── tailwind.config.js    # Tailwind CSS configuration
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── assets/
│   └── logo.png          # App logo (placeholder)
├── screens/
│   ├── HomeScreen.js     # Dashboard/home screen
│   ├── HumidorScreen.js  # Cigar collection management
│   ├── JournalScreen.js  # Tasting journal
│   ├── DiscoverScreen.js # AI recommendations
│   └── ProfileScreen.js  # Settings and premium features
├── components/
│   ├── CigarCard.js      # Reusable cigar display component
│   └── JournalEntryForm.js # Form for journal entries
└── utils/
    └── storage.js        # AsyncStorage utility functions
```

## 🎯 MVP Features

### ✅ Implemented
- Bottom tab navigation between all screens
- Humidor management (add, edit, remove cigars)
- Tasting journal with detailed entry forms
- Premium mode toggle with mock features
- Free humidifier claim functionality
- Local data persistence with AsyncStorage
- Responsive UI with consistent styling
- Mock AI recommendations on Discover screen

### 🔄 Mock Features (for MVP)
- AI recommendations are simulated with static data
- Premium features are toggled locally (no real payment)
- Free humidifier claim is a mock feature
- All data is stored locally (no cloud sync)

## 🎨 UI/UX Features

- **Consistent Design**: Brown/tan color scheme appropriate for cigar culture
- **Intuitive Navigation**: Bottom tabs for easy access to all features
- **Responsive Cards**: Clean card-based layout for content display
- **Form Validation**: Input validation for required fields
- **Loading States**: Visual feedback during data operations
- **Empty States**: Helpful messages when no data is present

## 🔧 Development Notes

### Data Storage
- All data is stored locally using AsyncStorage
- No backend or cloud services required
- Data persists between app sessions
- Clear all data option available in Profile screen (for testing)

### Premium Features
- Premium mode can be toggled in Profile screen
- When enabled, unlocks AI recommendations and humidifier claim
- Mock implementation - no real payment processing

### Testing
- Use the "Clear All Data" option in Profile to reset the app
- All features work offline
- Test on both iOS and Android devices

## 🚀 Future Enhancements

- Real AI integration for recommendations
- Cloud backup and sync
- Social features and community
- Barcode scanning for cigar identification
- Photo uploads for cigar images
- Advanced filtering and search
- Export/import functionality
- Push notifications
- Real payment processing for premium features

## 📄 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

This is an MVP project. For production use, consider adding:
- Error boundaries
- Loading states
- Offline handling
- Data validation
- Security measures
- Performance optimizations

---

**Happy Cigar Tasting! 🚬**
