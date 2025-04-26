// UI.tsx
import React from 'react';
import { Text, View, TouchableNativeFeedback, StyleSheet, Image } from 'react-native';
import { Car, RootStackParamList } from './Types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    return (
        <View style={{ flexDirection: 'row', backgroundColor: '#f2f2f2' }}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    navigation.navigate(route.name);
                };

                return (
                    <TouchableNativeFeedback key={route.key} onPress={onPress}>
                        <View style={{
                            flex: 1,
                            paddingVertical: 15,
                            backgroundColor: isFocused ? '#00b14f' : '#fff', // Darker on focus
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{
                                color: isFocused ? '#fff' : '#888',
                                fontWeight: 'bold',
                                fontSize: 14,
                            }}>
                                {label}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                );
            })}
        </View>
    );
};


type NavigationProp = StackNavigationProp<RootStackParamList, 'CarDetail'>;

export const CarCard = ({ item }: { item: Car }) => {
    const navigation = useNavigation<NavigationProp>();
    const handlePress = () => {
        navigation.navigate('CarDetail', { car: item }); 
    };

    return (
        <TouchableNativeFeedback onPress={handlePress}>
            <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.model}>{item.model}</Text>
                <Text style={styles.price}>Price per Day: RM {item.price}</Text>
            </View>
        </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 0.5,  // Ensure that each card takes approximately half the width
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 10,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginLeft: 5,
        marginRight: 5
    },
    model: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
    },
    price: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: 90, 
        borderRadius: 5,
        marginTop: 10,
    },
});