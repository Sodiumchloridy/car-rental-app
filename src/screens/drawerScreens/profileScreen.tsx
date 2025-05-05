import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { DrawerParamList } from '../../types/Types';

const App = () => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu-outline" size={28} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 50 }}>Profile</Text>
            </View>
        </View>
    );
}

export default App;