import React from 'react'
import { Text, View, TouchableNativeFeedback, Button, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
const Home = ({ route, navigation }: any) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu-outline" size={28} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 50, color: 'black' }}>This is home screen</Text>
                <Button
                    color='#00b14f'
                    title=" Rent a Car "
                    onPress={() => {
                        navigation.navigate('CarTabs');
                    }}
                />
            </View>
        </View>
    );
}

export default Home;