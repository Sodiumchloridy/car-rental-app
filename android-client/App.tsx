import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LogBox } from 'react-native';
import { CustomTabBar } from '@/components/UI';
import { RootStackParamList } from './src/types/Types';
import { UserProvider, useUser } from './src/context/UserContext';

// import car list screens
import sedanList from './src/screens/carListTabScreens/sedanList';
import suvList from './src/screens/carListTabScreens/suvList';
import luxuryList from './src/screens/carListTabScreens/luxuryList';

// import stack screens
import Home from './src/screens/stackScreens/HomeScreen';
import carDetail from './src/screens/stackScreens/CarDetail';
import Booking from './src/screens/stackScreens/booking';
import BookingConfirm from './src/screens/stackScreens/BookingConfirmation';

import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import Profile from './src/screens/drawerScreens/profileScreen';
import Notification from './src/screens/drawerScreens/NotificationScreen';
import CustomDrawerComponent from './src/screens/drawerScreens/CustomDrawerComponent';
import Ionicons from "react-native-vector-icons/Ionicons";
import LoginScreen from '@/screens/stackScreens/LoginScreen';

import RegisterScreen from '@/screens/stackScreens/RegisterScreen';

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
    return (
        <Tab.Navigator
            initialRouteName='sedanList'
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
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
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CarTabs" component={CarTypeBottomTab} />
        <Stack.Screen name="CarDetail" component={carDetail} />
        <Stack.Screen name="Booking" component={Booking} />
        <Stack.Screen name="BookingConfirm" component={BookingConfirm} />
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

    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerComponent {...props} />}
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
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default App;