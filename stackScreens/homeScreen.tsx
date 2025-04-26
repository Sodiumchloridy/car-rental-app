import React from 'react'
import { Text, View, TouchableNativeFeedback, Button } from 'react-native';

const App = ({ route, navigation }: any) => {
    return (
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
    );
}

export default App;