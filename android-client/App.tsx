import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme as NavLight, DarkTheme as NavDark } from '@react-navigation/native'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LogBox } from 'react-native';
import { CustomTabBar } from '@/components/UI';
import { RootStackParamList } from './src/types/Types';
import { UserProvider, useUser } from './src/context/UserContext';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, MD3DarkTheme as PaperDarkTheme, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import car list screens
import sedanList from './src/screens/carListTabScreens/sedanList';
import suvList from './src/screens/carListTabScreens/suvList';
import luxuryList from './src/screens/carListTabScreens/luxuryList';

// import stack screens
import Home from './src/screens/stackScreens/HomeScreen';
import carDetail from './src/screens/stackScreens/CarDetail';
import Booking from './src/screens/stackScreens/booking';
import BookingConfirm from './src/screens/stackScreens/BookingConfirmation';
import Chatroom from '@/screens/stackScreens/Chatroom';

import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import Profile from './src/screens/drawerScreens/ProfileScreen';
import Notification from './src/screens/drawerScreens/NotificationScreen';
import EditProfile from './src/screens/drawerScreens/EditProfile';
import History from './src/screens/drawerScreens/BookingHistoryScreen';
import CustomDrawerComponent from './src/screens/drawerScreens/CustomDrawerComponent';
import ChatList from '@/screens/stackScreens/ChatList';


import Ionicons from "react-native-vector-icons/Ionicons";
import LoginScreen from '@/screens/stackScreens/LoginScreen';

import RegisterScreen from '@/screens/stackScreens/RegisterScreen';
import ListCarScreen from '@/screens/stackScreens/CarListingScreen';

// test
import ChatTest from '@/test/ChatTest';

LogBox.ignoreLogs([
    'EventEmitter.removeListener',
    'This method is deprecated',
    'Method called was `collection`',
    'Method called was `add`'
]);

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CarTypeBottomTab = () => {
    const theme = useTheme();

    return (
        <Tab.Navigator
            initialRouteName='sedanList'
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.text
            }}
        >
            <Tab.Screen
                name='suvList'
                component={suvList}
                options={{
                    tabBarLabel: 'SUV',
                }}
            />
            <Tab.Screen
                name='sedanList'
                component={sedanList}
                options={{
                    tabBarLabel: 'Sedan',
                }}
            />
            <Tab.Screen
                name='luxuryList'
                component={luxuryList}
                options={{
                    tabBarLabel: 'Luxury',
                }}
            />
        </Tab.Navigator>
    )
}

const MainStack = () => (
    // change initial route to home after booking confirm page done
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
        {/* for testing chat */}
        <Stack.Screen name="Test" component={ChatTest} />

        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ChatList" component={ChatList} />
        <Stack.Screen name="Chatroom" component={Chatroom} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CarTabs" component={CarTypeBottomTab} />
        <Stack.Screen name="CarDetail" component={carDetail} />
        <Stack.Screen name="Booking" component={Booking} />
        <Stack.Screen name="BookingConfirm" component={BookingConfirm} />
        <Stack.Screen name="ListCarScreen" component={ListCarScreen} />
    </Stack.Navigator>
);

const App = () => {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}

// Create a separate component for the app content that uses the context
const AppContent = () => {
    const { user } = useUser();
    const [isDarkTheme, setIsDarkTheme] = React.useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('isDarkTheme');
                if (savedTheme !== null) {
                    setIsDarkTheme(JSON.parse(savedTheme));
                }
            } catch (error) {
                console.log('Error loading theme:', error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            await AsyncStorage.setItem('isDarkTheme', JSON.stringify(!isDarkTheme));
            setIsDarkTheme(!isDarkTheme);
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };
    const CustomDefaultTheme = {
        ...NavLight,
        ...PaperDefaultTheme,
        colors: {
            ...NavLight.colors,
            ...PaperDefaultTheme.colors,
            background: '#ffffff',
            text: '#333333',
            primary: '#00b14f',
            secondary: '#f1f1f1',
            surface: '#ffffff',
            border: '#e0e0e0',
        }
    }

    const CustomDarkTheme = {
        ...NavDark,
        ...PaperDarkTheme,
        colors: {
            ...NavDark.colors,
            ...PaperDarkTheme.colors,
            background: '#333333',
            text: '#ffffff',
            primary: '#00b14f',
            secondary: '#1f1f1f',
            surface: '#1f1f1f',
            border: '#444444',
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
                <Drawer.Navigator
                    drawerContent={(props) => (
                        <CustomDrawerComponent
                            {...props}
                            isDarkTheme={isDarkTheme}
                            toggleTheme={toggleTheme}
                        />
                    )}
                    screenOptions={{
                        drawerStyle: { width: '65%' },
                        headerShown: false,
                    }}
                >
                    <Drawer.Screen name="HomePage"
                        component={MainStack}
                        options={{
                            drawerIcon: ({ color }) => (
                                <Ionicons name="home-outline" size={20} color={color} />
                            ),
                            drawerLabelStyle: { fontSize: 20 },
                        }}
                    />
                    <Drawer.Screen name="Chats"
                        component={ChatList}
                        options={{
                            drawerIcon: ({ color }) => (
                                <Ionicons name="chatbubbles-outline" size={20} color={color} />
                            ),
                            drawerLabelStyle: { fontSize: 20 },
                        }}
                    />

                    {user ? (
                        <Drawer.Screen
                            name="Profile"
                            component={Profile}
                            options={{
                                drawerIcon: ({ color }) => (
                                    <Ionicons name="man-outline" size={20} color={color} />
                                ),
                                drawerLabelStyle: { fontSize: 20 },
                            }}
                        />
                    ) : (
                        <Drawer.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{
                                drawerIcon: ({ color }) => (
                                    <Ionicons name="log-in" size={20} color={color} />
                                ),
                                drawerLabelStyle: { fontSize: 20 },
                            }}
                        />
                    )}

                    <Drawer.Screen
                        name="Notification"
                        component={Notification}
                        options={{
                            drawerIcon: ({ color }) => (
                                <Ionicons name="notifications-outline" size={20} color={color} />
                            ),
                            drawerLabelStyle: { fontSize: 20 },
                        }}
                    />

                    <Drawer.Screen
                        name="Booking history"
                        component={History}
                        options={{
                            drawerIcon: ({ color }) => (
                                <Ionicons name="document-text-outline" size={20} color={color} />
                            ),
                            drawerLabelStyle: { fontSize: 18 },
                        }}
                    />
                    <Drawer.Screen
                        name="EditProfile"
                        component={EditProfile}
                        options={{
                            drawerItemStyle: { display: 'none' }, // Hide from drawer menu
                        }}
                    />
                </Drawer.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

export default App;