import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { DrawerParamList } from '../../types/Types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { FloatingAction } from 'react-native-floating-action';
import EditProfile from './EditProfile';

const ProfileScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  //hardcoded profile
  const profile = {
    profilePic: './assets/images/profilePic.jpg',
    firstName: 'John',
    lastName: 'Doe',
    phone: '1234567890',
    email: 'john@example.com',
  };

  const fields = [
    { key: 'firstName', icon: 'user-o', label: 'First Name', value: profile.firstName },
    { key: 'lastName', icon: 'user-o', label: 'Last Name', value: profile.lastName },
    { key: 'phone', icon: 'phone', label: 'Phone', iconType: Feather, value: profile.phone },
    { key: 'email', icon: 'envelope-o', label: 'Email', value: profile.email },
  ];

  const actions = [
    {
      text: 'Edit',
      icon: require('../../assets/images/edit_icon.jpg'),
      name: 'edit',
      position: 1,
      color: '#a80000',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={{ margin: 20 }}>
          <Text style={styles.name}>Profile</Text>

          {fields.map((item, index) => {
            const IconComponent = item.iconType || FontAwesome;
            return (
              <View key={index} style={styles.action}>
                <IconComponent name={item.icon} color="#333" size={20} />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <FloatingAction
        actions={actions}
        color="#a80000"
        onPressItem={name => {
          if (name === 'edit') {
            navigation.navigate('editProfile')
          }
        }}
      />
    </View>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  }
});
