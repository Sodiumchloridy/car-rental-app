import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        paddingTop: 40,
    },
    detailsCard: {
        marginTop: 20,
        marginHorizontal: 10,
        padding: 10,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    button: {
        width: '65%',
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 20,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
})