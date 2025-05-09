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
import config from '@/config.json';
import axios from 'axios'; // Import axios

const { height, width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [icNumber, setIcNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // Validate inputs
        if (!email || !password || !confirmPassword || !name || !icNumber || !phoneNumber) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }
        // Password validation
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        } else if (password.length > 20) {
            Alert.alert('Error', 'Password must be less than 20 characters long.');
            return;
        }

        // IC Number validation
        const icNumberRegex = /^[0-9]{12}$/; // Assuming IC number is 12 digits
        if (!icNumberRegex.test(icNumber)) {
            Alert.alert('Error', 'IC number must be 12 digits long.');
            return;
        }

        // Phone Number validation
        const phoneNumberRegex = /^[0-9]{10,15}$/;
        if (!phoneNumberRegex.test(phoneNumber)) {
            Alert.alert('Error', 'Phone number must be between 10 to 15 digits long.');
            return;
        }

        // Confirm Password validation
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Password confirmation do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${config.FLASK_API}/register`, {
                email,
                password,
                name,
                ic_number: icNumber,
                phone_number: phoneNumber
            }, {
                timeout: 5000 // 10 seconds timeout
            });

            // Check if the response is successful
            if (response.status === 200 || response.status === 201) {
                // Clear input fields
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIcNumber('');
                setPhoneNumber('');

                // Show success message
                Alert.alert(
                    'Success',
                    'Registration successful! Please log in.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            }
        } catch (error: any) { // Use 'any' for error type or a more specific axios error type
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    Alert.alert('Error', 'Request timed out. Please try again.');
                } else if (error.response?.status === 400) {
                    Alert.alert('Registration Failed', error.response.data || 'Failed to register');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    Alert.alert('Error', 'An unexpected error occurred. Please try again.');
                }
            } else {
                // Handle non-Axios errors
                Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

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
                    <View style={styles.registerCard}>
                        {/* Branding Section */}
                        <View style={styles.brandingContainer}>
                            <View style={styles.logoContainer}>
                                <Text style={styles.logoText}>CR</Text>
                            </View>
                            <Text style={styles.brandName}>Car Rental</Text>
                        </View>

                        <Text style={styles.welcomeText}>Create Account</Text>
                        <Text style={styles.subtitleText}>Sign up to get started</Text>

                        {/* Input Fields */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your full name"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="yourname@example.com"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholder="Create a password"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                placeholder="Confirm your password"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>IC Number</Text>
                            <TextInput
                                style={styles.input}
                                value={icNumber}
                                onChangeText={setIcNumber}
                                placeholder="Enter your IC number"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                placeholder="Enter your phone number"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.registerButtonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.haveAccountText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

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
        justifyContent: 'flex-end',
    },
    registerCard: {
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
    welcomeText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1D1D1F',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitleText: {
        fontSize: 16,
        color: '#86868B',
        textAlign: 'center',
        marginBottom: 36,
        letterSpacing: -0.2,
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
    registerButton: {
        backgroundColor: '#000',
        borderRadius: 14,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    haveAccountText: {
        fontSize: 15,
        color: '#86868B',
        marginRight: 4,
    },
    loginText: {
        fontSize: 15,
        color: '#007AFF',
        fontWeight: '500',
    },
});

export default RegisterScreen;