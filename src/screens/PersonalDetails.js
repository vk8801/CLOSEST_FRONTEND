import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal, 
  Animated, // <-- Added Animated for the floating label effect
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');
const PROFILE_PIC_SIZE = width * 0.25;
const IMAGE_GALLERY_HEIGHT = 150;
const INITIAL_IMAGES = [
  'https://placehold.co/150x150/808080/FFFFFF?text=Photo+1',
  'https://placehold.co/150x150/C0C0C0/333333?text=Photo+2',
  'https://placehold.co/150x150/A0A0A0/FFFFFF?text=Photo+3',
];
const INTEREST_OPTIONS = ['Women', 'Men', 'Everyone']; 

// --- Constants (Colors) ---
const COLORS = {
  backgroundTeal: '#4DC5D0',
  white: '#FFFFFF',
  darkBlue: '#3A4186',
  inputOutline: '#E0E0E0',
  coralRed: '#FF6347',
  primaryButton: '#4A90E2',
};

// --- Custom Components ---

// Component for a TextInput with a floating placeholder/label
const FloatingLabelInput = ({ label, keyboardType, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  
  // Animated value for translation and scale
  // Initializes to 1 if there's an initial value, or 0 if empty/unfocused
  const animatedIsFocused = useRef(new Animated.Value(value || isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // Required for animating layout properties like 'top'
    }).start();
  }, [isFocused, value, animatedIsFocused]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChangeText = (text) => setValue(text);

  // Interpolate styles for the floating label
  const labelStyle = {
    position: 'absolute',
    left: 10, 
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      // From centered (approx 55/2 - 18/2) to -10px above the border
      outputRange: [17, -10], 
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 12], 
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#888', COLORS.darkBlue],
    }),
    zIndex: 10,
    backgroundColor: COLORS.white, // Background to cover the border when floated
    paddingHorizontal: 5,
  };

  return (
    <View style={styles.inputFloatingContainer}>
      <Animated.Text style={labelStyle} pointerEvents="none">
        {label}
      </Animated.Text>
      <TextInput
        style={styles.inputFloatingText}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        keyboardType={keyboardType}
        {...props}
      />
    </View>
  );
};


// Component to simulate a Date Picker Input
const DatePickerInput = ({ value, onPress }) => (
  <TouchableOpacity style={styles.input} onPress={onPress}>
    <Text style={[styles.inputText, !value && { color: '#888' }]}>
      {value ? value.toLocaleDateString('en-GB') : 'DOB (DD/MM/YYYY)'}
    </Text>
    <AntDesign name="calendar" size={24} color="#888" />
  </TouchableOpacity>
);

// Component to simulate a Dropdown Input
const DropdownInput = ({ value, onPress }) => (
  <TouchableOpacity style={styles.input} onPress={onPress}>
    <Text style={[styles.inputText, !value && { color: '#888' }]}>
      {value || 'Interested In'}
    </Text>
    <AntDesign name="down" size={18} color="#888" />
  </TouchableOpacity>
);

// --- Dropdown Modal Component ---
const DropdownModal = ({ isVisible, onClose, onSelect, selectedValue }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Interested In</Text>
        {INTEREST_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedValue === option && styles.optionSelected,
            ]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// --- Date Picker Modal Component (Simplified) ---
const DatePickerModal = ({ isVisible, onClose, onConfirm, initialDate }) => {
  const initialDateString = initialDate ? initialDate.toLocaleDateString('en-GB') : '';
  const [dateString, setDateString] = useState(initialDateString);

  const handleConfirm = () => {
    // Basic validation and conversion (assuming DD/MM/YYYY)
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed month
      const year = parseInt(parts[2], 10);
      
      const newDate = new Date(year, month, day);
      if (!isNaN(newDate.getTime()) && newDate.getFullYear() === year && day === newDate.getDate()) {
        onConfirm(newDate);
        onClose();
        return;
      }
    }
    console.error('Invalid Date Format. Please use DD/MM/YYYY');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Enter Date of Birth</Text>
          <TextInput
            style={styles.dateInput}
            onChangeText={setDateString}
            value={dateString}
            placeholder="DD/MM/YYYY"
            keyboardType="numeric"
            maxLength={10}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


// --- Horizontal Image Carousel ---
const ImageCarousel = ({ images, activeIndex, setActiveIndex }) => {
  const flatListRef = useRef(null);
  const itemWidth = width - PROFILE_PIC_SIZE - 60; 

  const handleScroll = useCallback((event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / itemWidth);
    setActiveIndex(index);
  }, [setActiveIndex, itemWidth]);

  const scrollToImage = (direction) => {
    const newIndex = direction === 'next'
      ? Math.min(activeIndex + 1, images.length - 1)
      : Math.max(activeIndex - 1, 0);

    // Only scroll if the index actually changes
    if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        flatListRef.current.scrollToIndex({ 
            animated: true, 
            index: newIndex, 
            viewPosition: 0.5 
        });
    }
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.imageGalleryItem}>
      <Image source={{ uri: item }} style={styles.galleryImage} onError={(e) => console.log('Image failed to load', e.nativeEvent.error)} />
      {/* Removed upload icon from here to prevent it from scrolling */}
    </View>
  );


  return (
    <View style={styles.carouselContainer}>
      
      {/* Scrollable Image List */}
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: itemWidth, 
          offset: itemWidth * index,
          index,
        })}
      />

      {/* Fixed Upload Icon (New - outside FlatList) */}
      <TouchableOpacity 
          style={styles.fixedUploadIcon} 
          onPress={() => console.log('Fixed upload icon clicked to add image!')}
      >
          <Ionicons name="cloud-upload-outline" size={30} color={COLORS.white} />
      </TouchableOpacity>

      {/* Left Arrow (FIXED STYLING) */}
      {activeIndex > 0 && (
        <TouchableOpacity style={styles.arrowLeft} onPress={() => scrollToImage('prev')}>
          <AntDesign name="left" size={20} color={COLORS.white} />
        </TouchableOpacity>
      )}

      {/* Right Arrow (FIXED STYLING) */}
      {activeIndex < images.length - 1 && (
        <TouchableOpacity style={styles.arrowRight} onPress={() => scrollToImage('next')}>
          <AntDesign name="right" size={20} color={COLORS.white} />
        </TouchableOpacity>
      )}
      
    </View>
  );
};


// --- Component with Safe Area Insets Hook ---
const ProfileEditContent = () => {
  const insets = useSafeAreaInsets();
  
  // State for Form Fields
  const [dob, setDob] = useState(null); 
  const [interestedIn, setInterestedIn] = useState('Women'); 
  const [activeIndex, setActiveIndex] = useState(0); 
  
  // State for Modal Visibility
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDobPress = () => {
    setIsDatePickerVisible(true); 
  };
  const handleDateConfirm = (date) => {
    setDob(date);
    setIsDatePickerVisible(false);
  };


  const handleInterestedInPress = () => {
    setIsDropdownVisible(true); 
  };
  const handleInterestSelect = (value) => {
    setInterestedIn(value);
    setIsDropdownVisible(false);
  };
  const handleDropdownClose = () => {
    setIsDropdownVisible(false);
  };


  const handleProfilePicChange = () => {
    console.log('Change Profile Picture clicked - opening image selector.');
    // Logic to open camera roll or gallery
  };

  return (
    // Apply top inset to the main container
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      
      {/* Main Content Area (Teal Background) - Wrapped in ScrollView */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
           <Text style={styles.screenTitle}>Profile Details</Text>
        </View>

        {/* Profile Pictures & Gallery Section */}
        <View style={styles.profileSection}>
          
          {/* Main Profile Pic (Clickable) */}
          <TouchableOpacity 
            style={styles.mainProfilePicContainer}
            onPress={handleProfilePicChange}
          >
             {/* Profile Pic Placeholder */}
             <View style={styles.profileCircle}>
                <AntDesign name="user" size={PROFILE_PIC_SIZE * 0.6} color={COLORS.darkBlue} />
             </View>
             <Text style={styles.changePicText}>change profile Pic</Text>
          </TouchableOpacity>

          {/* Image Gallery Carousel */}
          <ImageCarousel 
            images={INITIAL_IMAGES} 
            activeIndex={activeIndex} 
            setActiveIndex={setActiveIndex} 
          />
        </View>


        {/* Form Input Fields */}
        <View style={styles.formContainer}>
          
          {/* Using the new FloatingLabelInput */}
          <FloatingLabelInput label="UserName" />
          <FloatingLabelInput label="Email" keyboardType="email-address" />
          <FloatingLabelInput label="Phone" keyboardType="phone-pad" />
          
          {/* DOB: Date Picker Implementation (Uses original input style) */}
          <DatePickerInput value={dob} onPress={handleDobPress} />
          
          {/* Interested In: Dropdown Implementation (Uses original input style) */}
          <DropdownInput value={interestedIn} onPress={handleInterestedInPress} />

        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => console.log('Profile Saved!')}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        
      </ScrollView>
      
      {/* --- MODALS RENDERED HERE --- */}
      <DatePickerModal
        isVisible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onConfirm={handleDateConfirm}
        initialDate={dob}
      />

      <DropdownModal
        isVisible={isDropdownVisible}
        onClose={handleDropdownClose}
        onSelect={handleInterestSelect}
        selectedValue={interestedIn}
      />
      {/* --------------------------- */}
    </View>
  );
};

// --- Main App Component (Wrapper) ---
const ProfileEditScreen = () => (
  <SafeAreaProvider>
    <ProfileEditContent />
  </SafeAreaProvider>
);

export default ProfileEditScreen;

// --- Common Arrow Style Definition (Moved out of StyleSheet.create to fix error) ---
const commonArrowStyle = {
  position: 'absolute',
  width: 30,
  height: 30,
  top: (IMAGE_GALLERY_HEIGHT + 10) / 2 - 15, // Center vertically
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.4)',
  borderRadius: 15,
  zIndex: 10, // CRITICAL: Ensure arrows are above the FlatList content
};

// --- Styles ---

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.backgroundTeal, 
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  // --- Header/Title Styles ---
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  
  // --- Profile Section ---
  profileSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    zIndex: 1, // Ensure this section is above the scroll view background if needed
  },
  mainProfilePicContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  profileCircle: {
    width: PROFILE_PIC_SIZE,
    height: PROFILE_PIC_SIZE,
    borderRadius: PROFILE_PIC_SIZE / 2,
    backgroundColor: COLORS.coralRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    marginBottom: 5,
  },
  changePicText: {
    fontSize: 12,
    color: COLORS.darkBlue,
    fontWeight: '600',
    textAlign: 'center',
  },

  // --- Image Carousel Styles ---
  carouselContainer: {
    width: width - PROFILE_PIC_SIZE - 60,
    height: IMAGE_GALLERY_HEIGHT + 10,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.inputOutline,
    zIndex: 5, 
  },
  imageGalleryItem: {
    width: width - PROFILE_PIC_SIZE - 60,
    height: IMAGE_GALLERY_HEIGHT,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  
  // New fixed upload icon style
  fixedUploadIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 15,
    padding: 2,
    zIndex: 15, // Higher than arrows (10) to ensure clickability
  },
  
  // Arrow styles now spread the common properties (FIXED)
  arrowLeft: {
    ...commonArrowStyle,
    left: 5,
  },
  arrowRight: {
    ...commonArrowStyle,
    right: 5,
  },
  
  // --- Form and Input Styles ---
  formContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  
  // Floating Label Input Styles
  inputFloatingContainer: {
    width: '100%',
    height: 55,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.inputOutline,
    paddingHorizontal: 15, // Padding applied to the container
    position: 'relative', // Necessary for absolute label positioning
    justifyContent: 'center',
  },
  inputFloatingText: {
    // These are the styles for the actual TextInput inside the container
    width: '100%',
    fontSize: 18,
    color: COLORS.darkBlue,
    padding: 0,
    paddingTop: 10, // Adjusted to make space for the floating label
  },

  // Original Input Style (used for DatePicker and Dropdown)
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
    borderWidth: 1,
    borderColor: COLORS.inputOutline,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 18,
    color: COLORS.darkBlue,
  },

  // --- Save Button Styles ---
  saveButton: {
    width: '80%',
    paddingVertical: 15,
    backgroundColor: COLORS.primaryButton,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: COLORS.primaryButton,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 5, width: 0 },
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },

  // --- Modal Styles ---
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.darkBlue,
  },
  dateInput: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputOutline,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: COLORS.primaryButton,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.darkBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  optionButton: {
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.inputOutline,
  },
  optionSelected: {
    backgroundColor: COLORS.backgroundTeal,
    borderColor: COLORS.backgroundTeal,
  },
  optionText: {
    fontSize: 18,
    color: COLORS.darkBlue,
  },
  optionTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
