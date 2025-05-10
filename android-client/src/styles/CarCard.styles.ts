import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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