import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'; // For the user profile icon

const { width } = Dimensions.get('window');

// --- Constants (Colors and Styles) ---
const COLORS = {
  backgroundTeal: '#4DC5D0',
  matchPurple: '#9370DB', // Purple for the main match text
  subHeaderPurple: '#B190E8', // Lighter, italic purple for "It's a"
  white: '#FFFFFF',
  darkBlue: '#3A4186', // Text color
  chatBubble: '#FCD7C8', // Light peach color for the chat item background
  messageBubble: '#D7C8FC', // Light lavender for the message speech bubble
};

// --- Header Component ---
const MatchHeader = () => (
  <View style={styles.topHeader}>
    <Text style={styles.headerItsA}>It's a</Text>
    <Text style={styles.headerMatch}>MATCH</Text>
  </View>
);

// --- Match Card Component ---
const MatchCard = ({ name, profileColor, messageColor }) => {
  const profileSize = width * 0.25;

  return (
    <View style={styles.matchCard}>
      
      {/* Profile Picture and Name Row */}
      <View style={styles.profileRow}>
        {/* Profile Picture Placeholder */}
        <View style={[styles.profileCircle, { 
          width: profileSize, 
          height: profileSize, 
          borderRadius: profileSize / 2 
        }]}>
          <AntDesign name="user" size={profileSize * 0.6} color={COLORS.darkBlue} />
        </View>

        {/* Name */}
        <Text style={styles.nameText}>{name}</Text>
      </View>

      {/* Message Bubble Placeholder */}
      <View style={styles.messageBubbleContainer}>
        <View style={styles.messageBubble}>
          {/* Placeholder for the first message text */}
        </View>
      </View>
    </View>
  );
};

// --- Component with Safe Area Insets Hook ---
const MatchContent = () => {
  const insets = useSafeAreaInsets();
  
  return (
    // Apply top inset to the main container
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      
      <MatchHeader />
      
      {/* Main Content Area (Teal Background) - Wrapped in ScrollView */}
      {/* We apply the bottom inset directly to the ScrollView content for correct spacing */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }} // Add extra bottom padding
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          
          {/* Render the Match Card */}
          <MatchCard name="Anamika" />

          {/* Add more content here if the screen extends (e.g., chat history) */}
        </View>
      </ScrollView>
    </View>
  );
};

// --- Main App Component (Wrapper) ---
const MatchScreen = () => (
  // SafeAreaProvider must wrap the entire application
  <SafeAreaProvider>
    <MatchContent />
  </SafeAreaProvider>
);

export default MatchScreen;

// --- Styles ---

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white, // White background for the header area
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.backgroundTeal, // Teal background for the main content area
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30, // Space below the header/teal color start
  },

  // --- Header Styles (Match Specific) ---
  topHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  headerItsA: {
    fontSize: 40,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 2,
    color: COLORS.subHeaderPurple,
  },
  headerMatch: {
    fontSize: 55,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    color: COLORS.backgroundTeal,
    textShadowColor: COLORS.matchPurple,
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 1,
  },

  // --- Match Card Styles ---
  matchCard: {
    width: '100%',
    backgroundColor: COLORS.chatBubble, 
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileCircle: {
    backgroundColor: COLORS.coralRed, // Reusing red color for the profile circle
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    marginRight: 15,
  },
  nameText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.darkBlue,
  },
  
  // --- Message Bubble Styles ---
  messageBubbleContainer: {
    width: '100%',
    alignItems: 'flex-start', // Message is from the match, so align left
  },
  messageBubble: {
    width: '80%', // Message bubble size
    height: 45,
    backgroundColor: COLORS.messageBubble,
    borderRadius: 15,
    padding: 10,
    // Creating the speech bubble tail effect (optional, simplified here)
    borderBottomLeftRadius: 0, 
    marginLeft: 55, // Aligning it below the text, slightly indented
  },
});
