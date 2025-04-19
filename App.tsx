import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import sedanList from './carList_tab/sedanList';
import suvList from './carList_tab/suvList';
import luxuryList from './carList_tab/luxuryList';
import { LogBox } from 'react-native';
import {Text, View} from 'react-native';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

const Tab = createBottomTabNavigator();

const App = () => {
    return(
        <NavigationContainer>
            <Tab.Navigator initialRouteName='sedanList'>
                <Tab.Screen
                    name='suvList'
                    component={suvList}
                    options={{
                        tabBarLabel: 'SUV',
                        tabBarIcon: () => null, // to remove icon placeholder
                        headerShown: false,     // to remove the header
                    }}
                />
                <Tab.Screen
                    name='sedanList'
                    component={sedanList}
                    options={{
                        tabBarLabel: 'Sedan',
                        tabBarIcon: () => null,
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name='luxuryList'
                    component={luxuryList}
                    options={{
                        tabBarLabel: 'Luxury',
                        tabBarIcon: () => null,
                        headerShown: false,     
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default App;