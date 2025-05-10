import { Car, RootStackParamList } from "@/types/Types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "react-native-paper";
import React from 'react';
import { Text, View, TouchableNativeFeedback, Image } from 'react-native';
import { styles } from "@/styles/CarCard.styles";

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