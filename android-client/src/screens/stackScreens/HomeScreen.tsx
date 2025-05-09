import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from 'react-native-linear-gradient';
import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');

const Home = ({ route, navigation }: any) => {
    const { user } = useUser();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#1a1a1a', '#333333', '#000000']}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
                    <Ionicons name="menu-outline" size={32} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.brandingContainer}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>CR</Text>
                    </View>
                    <Text style={styles.brandName}>Car Rental</Text>
                </View>
                <Text style={styles.titleText}>Welcome Home</Text>
                <Text style={styles.subtitleText}>Ready to find your next ride?</Text>


                {user ? (<><TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        navigation.navigate('CarTabs');
                    }}
                >
                    <Text style={styles.actionButtonText}>Rent a Car</Text>
                </TouchableOpacity><TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        navigation.navigate('ListCarScreen');
                    }}
                >
                        <Text style={styles.actionButtonText}>List Your Car</Text>
                    </TouchableOpacity></>) : (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            navigation.navigate('Login');
                        }}
                    >
                        <Text style={styles.actionButtonText}>Login</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    header: {
        paddingTop: 40,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    menuButton: {
        padding: 8,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    brandingContainer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoContainer: {
        width: 70,
        height: 70,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 32,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: -0.5,
    },
    brandName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    titleText: {
        fontSize: 34,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitleText: {
        fontSize: 18,
        color: '#AEAEB2',
        textAlign: 'center',
        marginBottom: 40,
        letterSpacing: -0.2,
    },
    actionButton: {
        backgroundColor: '#fff',
        borderRadius: 14,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.8,
        alignSelf: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 16,
    },
    actionButtonText: {
        color: '#000', // Black text on white button
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
});

export default Home;