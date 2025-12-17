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
import { AntDesign } from '@expo/vector-icons'; // Used for potential icons/arrows if needed later
import { useNavigation } from '@react-navigation/native'; // Add this import
import Login from './login'; // Import Login screen for navigation

const { width } = Dimensions.get('window');

// --- Constants (Colors and Styles) ---
const COLORS = {
  backgroundTeal: '#4DC5D0',
  white: '#FFFFFF',
  coralRed: '#FF6347', // Reddish color for Log Out button/Accents
  darkBlue: '#3A4186', // Primary text/User name color
  lightGrayBorder: '#D0D0D0',
};

// --- Menu Item Component ---
const MenuItem = ({ title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemText}>{title}</Text>
    {/* Optional: Add an arrow icon here if desired */}
    {/* <AntDesign name="right" size={20} color={COLORS.darkBlue} /> */}
  </TouchableOpacity>
);

// --- Component with Safe Area Insets Hook ---
const ProfileContent = () => {
  // Use the hook to get current safe area insets
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // Add this line

  // Menu items list
  const menuItems = [
    'Personal details',
    'Subscription Details',
    'Verify Account',
    'Alerts & Notification',
    'Contact',
    'About Us',
  ];
  const hadleMenuPress = (item) => () => {
    if (item === 'Personal details') {
      navigation.navigate('PersonalDetails');
    }
    // Add more navigation logic for other menu items as needed
  }

  return (
    // Apply insets to the main container
    <View style={[styles.mainContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* ScrollView is essential here to make sure all menu items and the button are accessible */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header Area (Top Half) */}
        <View style={styles.headerArea}>
          {/* Circular Profile Picture Placeholder */}
          <View style={styles.profileCircle}>
            {/* Simple face SVG placeholder using AntDesign for the icon */}
            <AntDesign name="user" size={width * 0.2} color={COLORS.darkBlue} />
          </View>
          <Text style={styles.userNameText}>UserName</Text>
        </View>

        {/* Menu Items Area */}
        <View style={styles.menuArea}>
          {menuItems.map((item, index) => (
            <MenuItem 
              key={index} 
              title={item} 
              onPress={ hadleMenuPress(item) } 
            />
          ))}

          {/* Log Out Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'login' }],
              })
            }
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};


// --- Main App Component (Wrapper) ---
const ProfileScreen = () => (
  // SafeAreaProvider must wrap the entire application
  <SafeAreaProvider>
    <ProfileContent />
  </SafeAreaProvider>
);

export default ProfileScreen;

// --- Styles ---

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundTeal, // Full screen teal background
  },
  scrollContent: {
    flexGrow: 1, // Ensures content takes up available space and allows scrolling
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  // --- Header/User Profile Styles ---
  headerArea: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  profileCircle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    backgroundColor: COLORS.coralRed, // Top circle background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden', // Ensures content stays inside the circle
    borderWidth: 5, // White border simulation
    borderColor: COLORS.white,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.darkBlue,
  },

  // --- Menu Styles ---
  menuArea: {
    width: '100%',
    paddingBottom: 40, // Space below the logout button
  },
  menuItem: {
    width: '100%',
    height: 55,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.darkBlue, // Outline color
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  menuItemText: {
    fontSize: 18,
    color: COLORS.darkBlue,
    fontWeight: '500',
  },

  // --- Button Styles ---
  logoutButton: {
    width: '70%',
    alignSelf: 'center',
    paddingVertical: 15,
    backgroundColor: COLORS.coralRed, // Red/Coral color for the button
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
