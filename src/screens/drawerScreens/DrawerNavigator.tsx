import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from './profileScreen';
import NotificationScreen from './NotificationScreen';
import CustomDrawerComponent from './customDrawerComponent';
import Ionicons from "react-native-vector-icons/Ionicons";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerComponent {...props} />}
            screenOptions={{
                drawerStyle: { width: '65%' },
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#000',
                headerShown: true,
            }}
        >
            <Drawer.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="man-outline" size={20} color={color} />
                    ),
                    drawerLabelStyle: { fontSize: 23 },
                }}
            />
            <Drawer.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    drawerIcon: ({ color }) => (
                        <Ionicons name="man-outline" size={20} color={color} />
                    ),
                    drawerLabelStyle: { fontSize: 23 },
                }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;