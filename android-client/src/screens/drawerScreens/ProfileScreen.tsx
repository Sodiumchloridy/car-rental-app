import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform, Dimensions, StatusBar, ScrollView } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { DrawerParamList, User } from '../../types/Types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { FloatingAction } from 'react-native-floating-action';
import LinearGradient from 'react-native-linear-gradient';
import config from '@/config.json';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookingHistory from '../../components/BookingHistory'; // Import BookingHistory

const { height, width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.get(`${config.FLASK_API}/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  },[]);

  const fields = [
    { key: 'firstName', icon: 'user-o', label: 'Full Name', value: user?.name },
    { key: 'phone', icon: 'phone', label: 'Phone Number', iconType: Feather, value: user?.phone_number },
    { key: 'email', icon: 'envelope-o', label: 'Email Address', value: user?.email },
    { key: 'icNumber', icon: 'id-card-o', label: 'IC Number', value: user?.ic_number}
  ];

  const actions = [
    {
      text: 'Edit Profile',
      icon: require('../../assets/images/edit_icon.jpg'), // Ensure this path is correct
      name: 'edit',
      position: 1,
      color: '#000000', // Changed to black for consistency
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a1a1a', '#333333', '#000000']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu-outline" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 32 }} />{/* Spacer for centering title */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          {fields.map((item, index) => {
            const IconComponent = item.iconType || FontAwesome;
            return (
              <View key={item.key} style={styles.fieldContainer}>
                <IconComponent name={item.icon} color="#4F4F4F" size={20} style={styles.fieldIcon} />
                <View style={styles.fieldTextContainer}>
                  <Text style={styles.fieldLabel}>{item.label}</Text>
                  <Text style={styles.fieldValue}>{item.value || 'Not set'}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Booking History Section */}
        <Text style={styles.sectionTitle}>Booking History</Text>
        <View style={styles.historyContainer}>
          <BookingHistory />
        </View>
      </ScrollView>

      <FloatingAction
        actions={actions}
        color="#000000" // Main button color
        onPressItem={name => {
          if (name === 'edit') {
            navigation.navigate('EditProfile');
          }
        }}
        floatingIcon={<Ionicons name="pencil-outline" size={24} color="#fff" />}
        iconHeight={24}
        iconWidth={24}
      />
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fallback
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 + 10 : 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80, // Space for FAB
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 24, // Keep horizontal padding
    paddingVertical: 12, // Adjust vertical padding if needed
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 24, // Add margin to separate from history
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  fieldIcon: {
    marginRight: 18,
  },
  fieldTextContainer: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#828282', // Subdued label color
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 17,
    color: '#333333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
    marginTop: 8, // Add some space above the title
  },
  historyContainer: {
    // This container can hold the BookingHistory component
    // It doesn't need a background color if BookingHistory cards are styled
    // Or, if BookingHistory itself doesn't have a card-like container for its list,
    // you might style this like profileCard.
    // For now, let's assume BookingHistory's FlatList is self-contained with styled cards.
  },
});
