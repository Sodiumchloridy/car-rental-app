import { Car, RootStackParamList } from "@/types/Types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "react-native-paper";
import React from 'react';
import { Text, View, TouchableNativeFeedback, Image, StyleSheet } from 'react-native';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CarDetail'>;

export const CarCard = ({ item }: { item: Car }) => {
    const navigation = useNavigation<NavigationProp>();
    const theme = useTheme();
    const handlePress = () => {
        navigation.navigate('CarDetail', { car: item });
    };
    
    return (
        <TouchableNativeFeedback onPress={handlePress}>
            <View style={[styles.card, {
                backgroundColor: theme.colors.surface, borderColor: theme.colors.onBackground
            }]}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={[styles.model, { color: theme.colors.onBackground }]}>
                    {item.model}
                </Text>
                <Text style={[styles.price, { color: theme.colors.onBackground }]}>
                    Price per Day: RM {item.price}
                </Text>
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