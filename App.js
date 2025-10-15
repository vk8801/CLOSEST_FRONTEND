import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

// --- Constants (Colors and Data) ---

const COLORS = {
  primaryBlue: '#4DC5D0', // Teal/Aqua background for the card and tabs
  darkText: '#3A4186',   // Dark purple text color (for name)
  lightText: '#9F5753',  // Subtler text color for tabs
  white: '#FFFFFF',
  lightGray: '#F0F0F0',
};

const TABS = ['Explore', 'Match', 'Discover', 'Chat', 'Profile'];

// --- Components ---

const TabButton = ({ name, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { backgroundColor: COLORS.primaryBlue }, // All buttons use the primary blue color
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabText,
          { color: isActive ? COLORS.darkText : COLORS.lightText },
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const ProfileCard = () => {
  return (
    <View style={styles.cardContainer}>
      {/* --- Image Placeholder (Top Section) --- */}
      <View style={styles.imagePlaceholder}>
        {/* Placeholder for the illustration - matching the reddish-brown/salmon color */}
        <View style={styles.illustrationBody} />
        {/* Simple placeholder for the head/face area */}
        <View style={styles.illustrationHead} />

        {/* --- Navigation Arrows --- */}
        <TouchableOpacity style={[styles.arrow, styles.arrowLeft]}>
          <AntDesign name="left" size={32} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.arrow, styles.arrowRight]}>
          <AntDesign name="right" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* --- Name & Age (Bottom Overlay) --- */}
      <View style={styles.infoOverlay}>
        <Text style={styles.nameText}>Akansha</Text>
        <Text style={styles.ageText}>21</Text>
      </View>
    </View>
  );
};

// Component to handle safe area view wrapper
const AppContent = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <ProfileCard />
      {/* Remove <TabBar ... /> */}
    </View>
  );
};

// --- Main App Component ---

export default function App() {
  // Wrap the entire app with SafeAreaProvider
  // NOTE: You will need to install 'react-native-safe-area-context' for this to work in your Expo project.
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  // Removed safeArea style as we now manage padding via insets
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Setting white background here
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingTop is now managed by insets in AppContent
  },

  // --- Profile Card Styles ---
  cardContainer: {
    width: CARD_WIDTH,
    height: height * 0.75, // Takes up about 75% of the screen height
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 30,
    overflow: 'hidden', // Crucial for containing the image and maintaining rounded corners
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  illustrationBody: {
    // Simple shape to approximate the girl's top/hair
    width: '100%',
    height: '60%',
    backgroundColor: '#9F5753', // Reddish-brown from the image
    borderTopLeftRadius: CARD_WIDTH * 0.5,
    borderTopRightRadius: CARD_WIDTH * 0.5,
    position: 'absolute',
    bottom: 0,
  },
  illustrationHead: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFDAB9', // Light skin tone
    borderRadius: 100,
    position: 'absolute',
    top: '15%',
    zIndex: 10,
  },
  arrow: {
    position: 'absolute',
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent black circle
    top: '45%',
  },
  arrowLeft: {
    left: 20,
  },
  arrowRight: {
    right: 20,
  },

  // --- Info Overlay Styles ---
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  nameText: {
    fontSize: 48,
    fontFamily: 'sans-serif', // Use a font that looks similar if you can load one
    fontWeight: '900',
    color: COLORS.darkText,
    letterSpacing: -1.5,
  },
  ageText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.darkText,
    paddingBottom: 5, // Align 21 with the baseline of Akansha
  },

  // --- Tab Bar Styles ---
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    // paddingBottom is now managed by insets in TabBar
  },
  tabButton: {
    width: width / 5.5, // Distribute evenly
    aspectRatio: 1, // Make it a circle
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // Slight shadow to lift the button
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
