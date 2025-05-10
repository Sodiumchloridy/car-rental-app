import { useUser } from '@/context/UserContext';
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Switch, TouchableRipple, useTheme } from 'react-native-paper';
import Ionicons from "react-native-vector-icons/Ionicons";
const CustomDrawerComponent = (props: any) => {
  const { user, logout } = useUser();
  const { isDarkTheme, toggleTheme } = props;
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#8200d6' }}>
        <ImageBackground
          source={require('../../assets/images/background.jpg')}
          style={{ padding: 20 }}>
          <Image
            source={require('../../assets/images/profilePic.jpg')}
            style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Roboto-Medium',
              marginBottom: 5,
            }}>
            {user?.name || 'Guest'}
          </Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: 10 }}>
          <DrawerItemList {...props} />

          <View style={styles.preferenceContainer}>
            <TouchableRipple onPress={toggleTheme}>
              <View style={styles.preference}>
                <View style={styles.preferenceLeft}>
                  <Ionicons name="moon-outline" size={20} color={theme.colors.onBackground} />
                  <Text style={[styles.preferenceText, { color: theme.colors.onBackground }]}>
                    Dark Theme
                  </Text>
                </View>
                <Switch value={isDarkTheme} onValueChange={toggleTheme} />
              </View>
            </TouchableRipple>
          </View>
        </View>
      </DrawerContentScrollView>

      {user && <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity onPress={async () => {
          await logout();
          props.navigation.navigate('Home');
        }}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="exit-outline" size={22} color={theme.colors.onBackground} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Roboto-Medium',
                marginLeft: 5,
                color: theme.colors.onBackground,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  preferenceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 18,
    marginLeft: 32,
    color: '#fff',
    fontFamily: 'Roboto-Medium',
    marginBottom: 5,
  }
});

export default CustomDrawerComponent;