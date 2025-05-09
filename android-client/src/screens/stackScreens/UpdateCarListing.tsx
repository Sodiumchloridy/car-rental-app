import React, { useState } from 'react'
import { updateCarListing } from '@/utils/FirebaseActions';
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
import LinearGradient from 'react-native-linear-gradient';
import { ReturnButton } from '@/components/UI';
import { Picker } from '@react-native-picker/picker';

const { height, width } = Dimensions.get('window');

export default function UpdateCarListing({ route, navigation }: any) {
    const { car } = route.params;

    const [model, setModel] = useState(car.model || '');
    const [price, setPrice] = useState(car.price ? car.price.toString() : '');
    const [category, setCategory] = useState(car.category || 'sedan');
    const [description, setDescription] = useState(car.description || '');
    const [fuelType, setFuelType] = useState(car.fuel_type || '');
    const [mileage, setMileage] = useState(car.mileage ? car.mileage.toString() : '');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        // Validate inputs
        if (!model || !price || !category || !description || !fuelType || !mileage) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        if (isNaN(Number(price)) || Number(price) <= 0) {
            Alert.alert('Error', 'Please enter a valid price');
            return;
        }

        if (isNaN(Number(mileage)) || Number(mileage) < 0) {
            Alert.alert('Error', 'Please enter a valid mileage');
            return;
        }

        setLoading(true);
        try {
            const updatedData = {
                model,
                price: Number(price),
                category,
                description,
                fuel_type: fuelType,
                mileage: Number(mileage),
            };

            const success = await updateCarListing(car.id, updatedData);
            if (success) {
                Alert.alert('Success', 'Car listing updated successfully', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('CarDetail', {
                            car: { ...car, ...updatedData }
                        }),
                    },
                ]);
            } else {
                Alert.alert('Error', 'Failed to update car listing');
            }
        } catch (error) {
            console.error('Error updating car listing:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ReturnButton color='white' />

            {/* Gradient Background */}
            <LinearGradient
                colors={['#1a1a1a', '#333333', '#000000']}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Floating Card Container */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.formContainer}
            >
                <ScrollView>
                    <View style={styles.updateCard}>
                        {/* Branding Section */}
                        <View style={styles.brandingContainer}>
                            <View style={styles.logoContainer}>
                                <Text style={styles.logoText}>CR</Text>
                            </View>
                            <Text style={styles.brandName}>Update Car Listing</Text>
                        </View>

                        {/* Form Fields */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Model</Text>
                            <TextInput
                                style={styles.input}
                                value={model}
                                onChangeText={setModel}
                                placeholder="Car Model (e.g. Toyota Camry)"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Price (RM per day)</Text>
                            <TextInput
                                style={styles.input}
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholder="Daily rental price"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Category</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={category}
                                    onValueChange={(itemValue) => setCategory(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Sedan" value="sedan" />
                                    <Picker.Item label="SUV" value="suv" />
                                    <Picker.Item label="Hatchback" value="hatchback" />
                                    <Picker.Item label="MPV" value="mpv" />
                                    <Picker.Item label="Pickup Truck" value="pickup" />
                                    <Picker.Item label="Sports Car" value="sports" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe your car"
                                placeholderTextColor="#8E8E93"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Fuel Type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={fuelType}
                                    onValueChange={(itemValue) => setFuelType(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Petrol" value="Petrol" />
                                    <Picker.Item label="Diesel" value="Diesel" />
                                    <Picker.Item label="Hybrid" value="Hybrid" />
                                    <Picker.Item label="Electric" value="Electric" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Mileage (km)</Text>
                            <TextInput
                                style={styles.input}
                                value={mileage}
                                onChangeText={setMileage}
                                keyboardType="numeric"
                                placeholder="Current mileage in kilometers"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        {/* Update Button */}
                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.updateButtonText}>Update Listing</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        height: height,
    },
    formContainer: {
        flex: 1,
        marginTop: 60,
    },
    updateCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 32,
        paddingTop: 36,
        paddingBottom: Platform.OS === 'ios' ? 40 : 28,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        minHeight: height * 0.9,
    },
    brandingContainer: {
        alignItems: 'center',
        marginBottom: 28,
    },
    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    logoText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#000',
        letterSpacing: -0.5,
    },
    brandName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1D1D1F',
        letterSpacing: -0.5,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1D1D1F',
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    input: {
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1D1D1F',
        letterSpacing: -0.2,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        backgroundColor: '#F5F5F7',
        borderRadius: 12,
    },
    picker: {
        height: 50,
        color: '#1D1D1F',
    },
    updateButton: {
        backgroundColor: '#000',
        borderRadius: 14,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
});