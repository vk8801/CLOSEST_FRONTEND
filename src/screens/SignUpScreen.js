import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [showPicker, setShowPicker] = useState(false);

  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Use the hook to get current safe area insets
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (password !== reEnterPassword) {
      Alert.alert('Validation', 'Passwords do not match!');
      return;
    }

    // If dob is empty, fallback to today to avoid invalid Date
    const formattedDob = dob ? new Date(dob).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          date_of_birth: formattedDob,
          email: email,
          password: password,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        // ignore JSON parse error
      }

      console.log('Status:', response.status);
      console.log('Response:', data);

      if (response.ok && data.status === 'pending_verification') {
        setRegisteredEmail(email);
        setVerificationModalVisible(true);
        Alert.alert('Verification Sent', 'Check your email for the 6-digit code.');
      }  else {
        Alert.alert('Registration failed', data.detail || data.message || 'Please try again');
      }
    } catch (error) {
      console.error('🚨 Network error:', error);
      Alert.alert('Network error', 'Check your backend server / connection.');
    }
  };

  const handleVerification = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          code: parseInt(verificationCode, 10),
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {}

      if (response.ok && data.status === 'verified') {
        setVerificationModalVisible(false);
        Alert.alert('Success', 'Email verified successfully!');
        navigation.replace('LogIn');
      } else {
        Alert.alert('Invalid Code', data.detail || 'Please try again');
      }
    } catch (error) {
      console.error('Verification Error:', error);
      Alert.alert('Error', 'Could not verify your code.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDob(formattedDate);
    }
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Header Section (White Background) */}
      <View style={styles.topHeader}>
        <HeaderText style={styles.headerUser}>User</HeaderText>
        <HeaderText style={styles.headerOnboarding}>ONBOARDING</HeaderText>
      </View>

      {/* Main Content Area (Teal Background) - Wrapped in ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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

          <View style={styles.dobWrapper}>
            <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.8}>
              <View style={styles.dobContainer}>
                <TextInput
                  style={styles.dobInput}
                  placeholder="DOB(YYYY-MM-DD)"
                  placeholderTextColor="#000"
                  value={dob}
                  editable={false}
                />
                <MaterialCommunityIcons name="calendar-month" size={26} color="#E53935" style={styles.calendarIcon} />
              </View>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={dob ? new Date(dob) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
          </View>

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
            placeholder="Re-enter Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={reEnterPassword}
            onChangeText={setReEnterPassword}
          />

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.centerText}>
            <Text style={styles.reminderText}>
              Already a member?{' '}
              <Text style={[styles.linkText, { color: COLORS.darkBlue }]} onPress={() => navigation.navigate('LogIn')}>
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

      {/* Verification Modal */}
      <Modal visible={verificationModalVisible} animationType="slide" transparent={true} onRequestClose={() => setVerificationModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify Your Email</Text>
            <Text style={styles.modalSubtitle}>A 6-digit code was sent to {registeredEmail}</Text>

            <TextInput
              style={[styles.input, styles.modalInputOverride]}
              placeholder="Enter verification code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.verifyButton} onPress={handleVerification}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVerificationModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- Main App Component (Wrapper) ---
const SignupScreen = () => (
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
  dobWrapper: {
    width: '100%',
    backgroundColor: '#7EE7ED', // turquoise background
    borderRadius: 12,
    padding: 8,
    marginBottom: 15,
    justifyContent: 'center',
  },

  dobContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // inner white box
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  dobInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  calendarIcon: {
    marginLeft: 8,
  },

  // --- Modal Styles (added) ---
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInputOverride: {
    width: '100%',
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    marginTop: 15,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
