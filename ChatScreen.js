import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'; // For the user profile icon

const { width } = Dimensions.get('window');

// --- Constants (Colors and Styles) ---
const COLORS = {
  backgroundTeal: '#4DC5D0',
  headerPurple: '#9370DB',
  white: '#FFFFFF',
  darkBlue: '#3A4186',
  chatBubble: '#FCD7C8', // Light peach color for the chat item background
  onlineGreen: '#4CD964', // Bright green for the online indicator
};

// --- Header Component ---
const HeaderText = () => (
  <View style={styles.topHeader}>
    <Text style={styles.headerUser}>User</Text>
    <Text style={styles.headerInteraction}>INTERACTION</Text>
  </View>
);

// --- Chat Item Component ---
const ChatListItem = ({ name, lastMessage, isOnline, onPress }) => {
  const profileSize = width * 0.2; // Consistent size for the profile picture

  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      
      {/* Profile Picture Placeholder */}
      <View style={styles.profileContainer}>
        <View style={[styles.profileCircle, { width: profileSize, height: profileSize, borderRadius: profileSize / 2 }]}>
          {/* Simple face SVG placeholder using AntDesign icon */}
          <AntDesign name="user" size={profileSize * 0.7} color={COLORS.darkBlue} />
        </View>
        
        {/* Online Indicator */}
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.messageText}>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

// --- Component with Safe Area Insets Hook ---
const ChatListContent = () => {
  const insets = useSafeAreaInsets();
  
  // Mock data for the chat list
  const chatData = [
    { id: '1', name: 'Alice', lastMessage: 'See you tomorrow!', isOnline: true },
    { id: '2', name: 'Bob', lastMessage: 'Did you finish the assignment?', isOnline: true },
    { id: '3', name: 'Charlie', lastMessage: 'Sounds good to me.', isOnline: false },
    { id: '4', name: 'Diana', lastMessage: 'I need help with React Native...', isOnline: true },
    { id: '5', name: 'Eve', lastMessage: 'Happy birthday!', isOnline: false },
    { id: '6', name: 'Frank', lastMessage: 'Check out the new design.', isOnline: true },
    // Add more items to demonstrate ScrollView functionality
    { id: '7', name: 'Grace', lastMessage: 'Will be late today.', isOnline: false },
    { id: '8', name: 'Heidi', lastMessage: 'Okay!', isOnline: true },
  ];

  return (
    // Apply insets to the main container
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      
      <HeaderText />
      
      {/* Main Content Area (Teal Background) - Wrapped in ScrollView */}
      {/* We apply the bottom inset directly to the ScrollView content for correct spacing */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }} // Add extra bottom padding
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {chatData.map((chat) => (
            <ChatListItem
              key={chat.id}
              name={chat.name}
              lastMessage={chat.lastMessage}
              isOnline={chat.isOnline}
              onPress={() => console.log(`Open chat with ${chat.name}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// --- Main App Component (Wrapper) ---
const ChatListScreen = () => (
  // SafeAreaProvider must wrap the entire application
  <SafeAreaProvider>
    <ChatListContent />
  </SafeAreaProvider>
);

export default ChatListScreen;

// --- Styles ---

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white, // White background for the header area
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.backgroundTeal, // Teal background for the main content area
    // No horizontal padding here, it's added inside contentContainer
  },
  contentContainer: {
    // This view holds the chat list items
    padding: 20,
    backgroundColor: COLORS.backgroundTeal,
    flexGrow: 1,
  },

  // --- Header Styles (Reused from Onboarding) ---
  topHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  headerUser: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    color: COLORS.headerPurple,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  headerInteraction: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    color: COLORS.backgroundTeal,
    textShadowColor: COLORS.headerPurple,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 1,
  },

  // --- Chat Item Styles ---
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 100,
    backgroundColor: COLORS.chatBubble,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  
  // Profile Picture and Online Indicator
  profileContainer: {
    marginRight: 15,
  },
  profileCircle: {
    backgroundColor: COLORS.coralRed, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: COLORS.onlineGreen,
    borderWidth: 2,
    borderColor: COLORS.chatBubble, 
  },

  // Text Content
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkBlue,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.darkBlue,
    opacity: 0.7,
  },
});
