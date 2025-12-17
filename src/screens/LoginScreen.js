import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView, // <-- Add this import
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'; // Import safe area context hooks
import { useNavigation } from '@react-navigation/native'; // Add this import
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SignUpScreen from './SignUpScreen';

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
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkboxTick}>✓</Text>}
    </View>
  </TouchableOpacity>
);

const UserOnboardingContent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const insets = useSafeAreaInsets(); // Get current safe area insets
  const navigation = useNavigation(); // Add this line

  // Add this function
  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:username,
          password:password,
        }),
      });
      const data = await response.json();
      // Handle API response here (e.g., navigate on success)
      console.log(username, password);
      console.log(data.status_code);
      if (data.status_code === 200) {
        
        console.log("Login Success")
        navigation.replace('Home'); // Navigate to Home screen on success
  
      } else {
        // Show error message or handle failure
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Network error');
    }
  };
  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log('Google login pressed');

  };
  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
    console.log('Facebook login pressed');
  };
  return (
    <View style={[styles.fullScreen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Background Header Section */}
      <View style={styles.backgroundHeader}>
        <HeaderText style={styles.headerUser}>User</HeaderText>
        <HeaderText style={styles.headerOnboarding}>ONBOARDING</HeaderText>
      </View>

      {/* Main Content Area (Teal Background) */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 120 }]} // Add top padding so header is visible
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Transparent Logo Circle */}
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
            <TouchableOpacity onPress={() =>navigation.navigate('ForgotPassword')}>
              <Text style={[styles.linkText, { color: COLORS.darkBlue }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={styles.centerText}>
            <Text style={styles.reminderText}>
              New User?{' '}
              <Text
                style={[styles.linkText, { color: COLORS.darkBlue }]}
                onPress={() => navigation.navigate('SignUp')} // Change here
              >
                SignUp
              </Text>
            </Text>

            <Text style={styles.orText}>OR Continue with</Text>

            {/* Social Icons Row */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                <FontAwesome name="google" size={30} color="#DB4437" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                <MaterialCommunityIcons name="facebook" size={30} color="#3b5998" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// --- Main App Component (Wrapper) ---
const LogininScreen = () => (
  <SafeAreaProvider>
    <UserOnboardingContent />
  </SafeAreaProvider>
);


// Set App as the export component
export default LogininScreen;

// --- Styles ---

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // --- Background Header Styles ---
  backgroundHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2, // Increase zIndex so header is above scroll content
    paddingTop: 40,
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
    zIndex: 1,
  },
  logoCircle: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: (width * 0.4) / 2,
    backgroundColor: 'rgba(255,255,255,0.2)', // Transparent white
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0, // Show full circle, no negative margin
    marginBottom: 40,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  logoText: {
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)', // Transparent white text
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white, // Ensure background is white
  },
  checkboxChecked: {
    backgroundColor: COLORS.redText,
  },
  checkboxTick: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
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
  scrollContent: {
    flexGrow: 1,
    // paddingTop is now set inline in ScrollView for header visibility
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    gap: 20,
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120, // Ensure both buttons have the same minimum width
    width: 150,
  },
  socialText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.darkBlue,
    fontWeight: '600',
    textAlign: 'center',
  },
});
