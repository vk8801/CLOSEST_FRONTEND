import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  // Removed SafeAreaView import
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'; // Import safe area context hooks
// Note: You might need to install 'expo-font' to use custom fonts, 
// but for simplicity, we'll use system fonts with high weight/style.

const { width } = Dimensions.get('window');

// --- Constants (Colors and Styles) ---

const COLORS = {
  backgroundTeal: '#4DC5D0',
  headerPurple: '#9370DB', // Approximate purple color for User Onboarding text
  redText: '#D04D4D',
  white: '#FFFFFF',
  lightGray: '#F0F0F0',
  darkBlue: '#3A4186',
};

const HeaderText = ({ children, style }) => (
  <Text style={[styles.headerText, style]}>{children}</Text>
);

// --- Components ---

// A simple Checkbox replacement for cross-platform consistency
const CustomCheckbox = ({ checked, onPress }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
  </TouchableOpacity>
);

const UserOnboardingContent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const insets = useSafeAreaInsets(); // Get current safe area insets

  return (
    <View style={[styles.fullScreen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Header Section */}
      <View style={styles.topHeader}>
        <HeaderText style={styles.headerUser}>User</HeaderText>
        <HeaderText style={styles.headerOnboarding}>ONBOARDING</HeaderText>
      </View>

      {/* Main Content Area (Teal Background) */}
      <View style={styles.contentContainer}>
        {/* Logo Circle */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>Logo</Text>
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome Back</Text>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="UserName"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Remember Me / Forgot Password */}
        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <CustomCheckbox checked={rememberMe} onPress={() => setRememberMe(!rememberMe)} />
            <Text style={styles.reminderText}>Remember me</Text>
          </View>
          <TouchableOpacity onPress={() => console.log('Forgot Password')}>
            <Text style={[styles.linkText, { color: COLORS.darkBlue }]}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={() => console.log('Login')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <View style={styles.centerText}>
          <Text style={styles.reminderText}>
            New User?{' '}
            <Text style={[styles.linkText, { color: COLORS.darkBlue }]} onPress={() => console.log('Signup')}>
              SignUp
            </Text>
          </Text>

          <Text style={styles.orText}>OR Continue with</Text>

          {/* Social Links */}
          <TouchableOpacity onPress={() => console.log('Google')}>
            <Text style={[styles.linkText, { color: COLORS.darkBlue, marginBottom: 5 }]}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Facebook')}>
            <Text style={[styles.linkText, { color: COLORS.darkBlue }]}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- Main App Component (Wrapper) ---
const UserOnboardingScreen = () => (
  <SafeAreaProvider>
    <UserOnboardingContent />
  </SafeAreaProvider>
);


// Set App as the export component
export default UserOnboardingScreen;

// --- Styles ---

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // --- Header Styles ---
  topHeader: {
    paddingHorizontal: 20,
    // paddingTop and paddingBottom removed here, now handled by insets in UserOnboardingContent
    paddingBottom: 20, 
  },
  headerText: {
    // Mimics a custom, thick, rounded font style
    fontWeight: '900', // Heavy weight for thickness
    letterSpacing: 2,
    textAlign: 'center',
  },
  headerUser: {
    fontSize: 48,
    color: COLORS.headerPurple,
    // Add text shadow to mimic the outline/3D effect
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  headerOnboarding: {
    fontSize: 48,
    color: COLORS.backgroundTeal,
    // Add text shadow to mimic the outline/3D effect
    textShadowColor: COLORS.headerPurple,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 1,
  },

  // --- Content Styles ---
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundTeal,
    alignItems: 'center',
    padding: 30,
  },
  logoCircle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -width * 0.2, // Move the circle partially into the header area
    marginBottom: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  logoText: {
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#000',
  },
  welcomeText: {
    fontSize: 18,
    color: COLORS.redText,
    marginBottom: 20,
  },

  // --- Input Styles ---
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    // Add subtle shadow/border to match the image
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 14,
    color: COLORS.redText,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // --- Checkbox Styles ---
  checkboxContainer: {
    padding: 5,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: COLORS.redText,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: COLORS.redText,
  },

  // --- Button Styles ---
  loginButton: {
    width: '50%',
    paddingVertical: 12,
    backgroundColor: '#73C6E5', // Lighter blue for the button
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 40,
    elevation: 5,
  },
  loginButtonText: {
    color: COLORS.darkBlue,
    fontSize: 18,
    fontWeight: '700',
  },

  // --- Footer Links ---
  centerText: {
    alignItems: 'center',
  },
  orText: {
    fontSize: 14,
    color: COLORS.redText,
    marginVertical: 15,
  },
});
