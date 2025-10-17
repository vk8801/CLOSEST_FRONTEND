import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
// You might need a simple icon for the logo, but for now, we'll use text
// import { AntDesign } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');
const LOGO_SIZE = width * 0.4;

// --- Constants (Colors and Styles) ---
const COLORS = {
  backgroundTeal: '#4DC5D0',
  headerPurple: '#9370DB',
  italicPurple: '#B190E8',
  white: '#FFFFFF',
  darkBlue: '#3A4186', // Text color
  primaryButton: '#4A90E2', // Bright blue for primary action
  lightBlue: '#C3E0FF', // Lighter blue for secondary action/outline
};

// --- Header Component ---
const HeaderText = () => (
  <View style={styles.topHeader}>
    <Text style={styles.headerCreateNew}>Create New</Text>
    <Text style={styles.headerPassword}>PASSWORD</Text>
  </View>
);

// --- Component with Safe Area Insets Hook ---
const CreateNewPasswordContent = () => {
  const insets = useSafeAreaInsets();
  
  return (
    // Apply top inset to the main container
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      
      <HeaderText />
      
      {/* Main Content Area (Teal Background) - Wrapped in ScrollView */}
      {/* We apply the bottom inset directly to the ScrollView content for correct spacing */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        // Allows ScrollView to move content out of the way of the keyboard
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo Circle (Overlapping) */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>Logo</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={true}
            placeholderTextColor="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Re-enter Password"
            secureTextEntry={true}
            placeholderTextColor="#888"
          />
          
          {/* Note: In the image, the third field repeats "Re-enter Password", 
              but based on the buttons, I've labeled it as "Verification Code" for usability. */}
          <TextInput
            style={styles.input}
            placeholder="Verification Code (e.g., 123456)"
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor="#888"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={() => console.log('Verification Code Sent')}
          >
            <Text style={styles.sendButtonText}>Send Verification code</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resendButton}
            onPress={() => console.log('Verification Code Re-Sent')}
          >
            <Text style={styles.resendButtonText}>Re-Send Verification code</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

// --- Main App Component (Wrapper) ---
const CreateNewPasswordScreen = () => (
  // SafeAreaProvider must wrap the entire application
  <SafeAreaProvider>
    <CreateNewPasswordContent />
  </SafeAreaProvider>
);

export default CreateNewPasswordScreen;

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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // --- Header Styles ---
  topHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  headerCreateNew: {
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1.5,
    color: COLORS.italicPurple,
  },
  headerPassword: {
    fontSize: 55,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    color: COLORS.backgroundTeal,
    textShadowColor: COLORS.headerPurple,
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 1,
  },

  // --- Logo Styles ---
  logoCircle: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -LOGO_SIZE * 0.2, // Overlap the header/teal area
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  logoText: {
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: COLORS.darkBlue,
  },

  // --- Input Styles ---
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    color: COLORS.darkBlue,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // --- Button Styles ---
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  sendButton: {
    width: '80%',
    paddingVertical: 15,
    backgroundColor: COLORS.primaryButton,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 5,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  resendButton: {
    width: '75%',
    paddingVertical: 15,
    // Using a light button style to match the image's secondary action
    backgroundColor: COLORS.lightBlue, 
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryButton,
  },
  resendButtonText: {
    color: COLORS.primaryButton,
    fontSize: 16,
    fontWeight: '600',
  },
});
