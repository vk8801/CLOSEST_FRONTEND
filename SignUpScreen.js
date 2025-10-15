import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  // Removed standard SafeAreaView import
} from 'react-native';
// Added imports for modern safe area handling
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // Add this import

const { width } = Dimensions.get('window');

// --- Constants (Colors and Styles) ---
const COLORS = {
  backgroundTeal: '#4DC5D0',
  headerPurple: '#9370DB', // Approximate purple color for User Onboarding text
  redText: '#D04D4D',
  white: '#FFFFFF',
  lightGray: '#F0F0F0',
  darkBlue: '#3A4186',
  buttonBlue: '#73C6E5', // Lighter blue for the button
};

const HeaderText = ({ children, style }) => (
  <Text style={[styles.headerText, style]}>{children}</Text>
);

// --- Component with Safe Area Insets Hook ---
const SignupContent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');

  // Use the hook to get current safe area insets
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // Add this line

  return (
    // We apply the top and bottom insets directly to the main container
    <View style={[styles.mainContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Header Section (White Background) */}
      <View style={styles.topHeader}>
        <HeaderText style={styles.headerUser}>User</HeaderText>
        <HeaderText style={styles.headerOnboarding}>ONBOARDING</HeaderText>
      </View>

      {/* Main Content Area (Teal Background) - Wrapped in ScrollView */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" 
      >
        <View style={styles.contentContainer}>
          {/* Logo Circle */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>Logo</Text>
          </View>
          
          {/* --- Input Fields --- */}
          
          {/* First Name / Last Name Row */}
          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="FirstName"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="LastName"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="DOB(DD/MM/YYYY)"
            placeholderTextColor="#888"
            value={dob}
            onChangeText={setDob}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
          <TextInput
            style={styles.input}
            placeholder="Re-enter Passwords"
            placeholderTextColor="#888"
            secureTextEntry
            value={reEnterPassword}
            onChangeText={setReEnterPassword}
          />

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={() => console.log('Sign Up Attempted')}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.centerText}>
            <Text style={styles.reminderText}>
              Already a member?{' '}
              <Text 
                style={[styles.linkText, { color: COLORS.darkBlue }]} 
                onPress={() => navigation.navigate('Login')} // Change here
              >
                Login
              </Text>
            </Text>

            <Text style={styles.orText}>OR Continue with</Text>

            {/* Social Links */}
            <TouchableOpacity onPress={() => console.log('Google Signup')}>
              <Text style={[styles.linkText, { color: COLORS.darkBlue, marginBottom: 5 }]}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Facebook Signup')}>
              <Text style={[styles.linkText, { color: COLORS.darkBlue }]}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// --- Main App Component (Wrapper) ---
const SignupScreen = () => (
  // SafeAreaProvider must wrap the entire application or root component
  <SafeAreaProvider>
    <SignupContent />
  </SafeAreaProvider>
);

export default SignupScreen;

// --- Styles ---

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1, // Allows the content to expand and scroll
    backgroundColor: COLORS.backgroundTeal,
  },
  // --- Header Styles ---
  topHeader: {
    paddingHorizontal: 20,
    // Removed paddingTop: 40; now handled by insets in mainContainer
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  headerText: {
    fontWeight: '900', 
    letterSpacing: 2,
    textAlign: 'center',
  },
  headerUser: {
    fontSize: 48,
    color: COLORS.headerPurple,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  headerOnboarding: {
    fontSize: 48,
    color: COLORS.backgroundTeal,
    textShadowColor: COLORS.headerPurple,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 1,
  },

  // --- Content Styles ---
  contentContainer: {
    flex: 1,
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

  // --- Input Styles ---
  nameRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  halfInput: {
    width: '48.5%', 
    marginBottom: 0, 
  },
  
  // --- Footer Links ---
  signupButton: {
    width: '50%',
    paddingVertical: 12,
    backgroundColor: COLORS.buttonBlue,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    elevation: 5,
  },
  signupButtonText: {
    color: COLORS.darkBlue,
    fontSize: 18,
    fontWeight: '700',
  },
  centerText: {
    alignItems: 'center',
    paddingBottom: 20,
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
  orText: {
    fontSize: 14,
    color: COLORS.redText,
    marginVertical: 15,
  },
});
