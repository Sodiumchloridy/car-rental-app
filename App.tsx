import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LogBox } from 'react-native';
import { CustomTabBar } from './UI';
import { RootStackParamList } from './Types';

// import car list screens
import sedanList from './carListTabScreens/sedanList';
import suvList from './carListTabScreens/suvList';
import luxuryList from './carListTabScreens/luxuryList';

// import stack screens
import home from './stackScreens/homeScreen';
import carDetail from './stackScreens/carDetail';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

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

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen
                    name='Home'
                    component={home}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='CarTabs'
                    component={CarTypeBottomTab}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='CarDetail'
                    component={carDetail}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
