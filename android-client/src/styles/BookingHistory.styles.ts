import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 8,
        paddingHorizontal: 0,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#1A1A1A',
    },
    detailText: {
        fontSize: 14,
        marginBottom: 6,
        color: '#333333',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noDataText: {
        fontSize: 16,
        color: '#CCCCCC',
    }
});