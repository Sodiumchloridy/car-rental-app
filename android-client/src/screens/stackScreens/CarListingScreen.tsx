import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ScrollView
} from 'react-native';
import { useUser } from '../../context/UserContext';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addCarListing } from '@/utils/FirebaseActions';

const { height, width } = Dimensions.get('window');

const ListCarScreen = ({ navigation }: any) => {
    const { user } = useUser();
    const [model, setModel] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [mileage, setMileage] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleListCar = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to list a car.');
            return;
        }

        // Enhanced validation for required fields
        const requiredFields: { [key: string]: string } = { model, description, price, category, fuelType, mileage, image };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                Alert.alert('Error', `Please fill in the ${key} field.`);
                return;
            }
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            Alert.alert('Error', 'Invalid price. Please enter a valid number.');
            return;
        }

        const parsedMileage = parseFloat(mileage);
        if (isNaN(parsedMileage)) {
            Alert.alert('Error', 'Invalid mileage. Please enter a valid number.');
            return;
        }

        if (!user.name) {
            Alert.alert('Error', 'User name is missing. Cannot list car.');
            console.error('User object details:', JSON.stringify(user, null, 2));
            return;
        }

        setLoading(true);
        try {
            const carData = {
                owner_name: user.name,
                owner_uuid: user.uuid,
                model,
                description,
                price: parsedPrice,
                category,
                fuel_type: fuelType,
                mileage: parsedMileage,
                image,
                availability: 1,
            };

            const success = await addCarListing(carData);

            if (success) {
                Alert.alert('Success', 'Your car has been listed successfully!');
                // Optionally, clear the form fields
                setModel('');
                setDescription('');
                setPrice('');
                setCategory('');
                setFuelType('');
                setMileage('');
                setImage('');
                navigation.goBack();
            } else {
                // addCarListing should have logged the specific Firebase error
                Alert.alert('Error', 'Failed to list your car. Please check the console for more details or try again.');
            }
        } catch (error) {
            // This catch block handles errors not caught within addCarListing or other synchronous errors
            console.error('Error in handleListCar:', error);
            Alert.alert('Error', 'An unexpected error occurred while trying to list your car. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back-outline" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>List Your Car</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.formContainer}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Model</Text>
                        <TextInput
                            style={styles.input}
                            value={model}
                            onChangeText={setModel}
                            placeholder="e.g., Toyota Camry"
                            placeholderTextColor="#8E8E93"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="e.g., Fuel-efficient sedan, great for city driving."
                            placeholderTextColor="#8E8E93"
                            multiline
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Price (per day)</Text>
                        <TextInput
                            style={styles.input}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            placeholder="e.g., 50"
                            placeholderTextColor="#8E8E93"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Category</Text>
                        <TextInput
                            style={styles.input}
                            value={category}
                            onChangeText={setCategory}
                            placeholder="e.g., Sedan, SUV, Hatchback"
                            placeholderTextColor="#8E8E93"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Fuel Type</Text>
                        <TextInput
                            style={styles.input}
                            value={fuelType}
                            onChangeText={setFuelType}
                            placeholder="e.g., Petrol, Diesel, Electric"
                            placeholderTextColor="#8E8E93"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Mileage (km)</Text>
                        <TextInput
                            style={styles.input}
                            value={mileage}
                            onChangeText={setMileage}
                            keyboardType="numeric"
                            placeholder="e.g., 30500"
                            placeholderTextColor="#8E8E93"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Image URL</Text>
                        <TextInput
                            style={styles.input}
                            value={image}
                            onChangeText={setImage}
                            keyboardType="url"
                            placeholder="e.g., https://example.com/car.png"
                            placeholderTextColor="#8E8E93"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.listCarButton}
                        onPress={handleListCar}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.listCarButtonText}>List Car</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fallback color
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: height,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 50 : 40, // Adjust for status bar
        paddingBottom: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark tint for header
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#fff',
    },
    formContainer: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 20,
        paddingBottom: 40, // Extra padding at the bottom
    },
    inputGroup: {
        marginBottom: 18,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#E0E0E0', // Lighter text for labels on dark background
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Semi-transparent white
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#FFFFFF', // White text color for input
        letterSpacing: -0.2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top', // For Android
    },
    dateText: {
        color: '#FFFFFF', // White text color for input
        fontSize: 16,
    },
    listCarButton: {
        backgroundColor: '#fff', // White button, consistent with HomeScreen
        borderRadius: 14,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20, // Spacing above the button
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    listCarButtonText: {
        color: '#000', // Black text on white button
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
});

export default ListCarScreen;
