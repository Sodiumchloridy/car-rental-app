import config from '@/config.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useUser } from '../../context/UserContext';

const { height, width } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${config.FLASK_API}/login`, {
                email,
                password,
            }, {
                timeout: 5000 // 5 seconds timeout
            });

            const data = await response.data;
            if (response.status === 200) {
                await AsyncStorage.setItem('userToken', data.token);
                setUser({
                    uuid: data.user.uuid,
                    name: data.user.name,
                    email: data.user.email,
                    ic_number: data.user.ic,
                    phone_number: data.user.phone_no,
                });

                // Clear input fields
                setEmail('');
                setPassword('');
                Alert.alert('Success', 'Login successful!');
                navigation.navigate('Home');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                Alert.alert('Login Failed', 'Invalid credentials');
            }
            else {
                Alert.alert('Error', 'Network error. Please try again.');
            }
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
                <View style={styles.loginCard}>
                    {/* Branding Section */}
                    <View style={styles.brandingContainer}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>CR</Text>
                        </View>
                        <Text style={styles.brandName}>Car Rental</Text>
                    </View>

                    <Text style={styles.welcomeText}>Welcome Back</Text>
                    <Text style={styles.subtitleText}>Sign in to continue to your account</Text>

                    {/* Input Fields */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#8E8E93"
                            placeholder="yourname@example.com"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#8E8E93"
                            placeholder="Enter your password"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.forgotPasswordBtn}
                        onPress={() => Alert.alert('Forgot Password', 'Please email to support@car-rental.com for assistance.')}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.signInButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Create Account Link */}
                    <View style={styles.createAccountContainer}>
                        <Text style={styles.noAccountText}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.createAccountText}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    loginCard: {
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
    forgotPasswordBtn: {
        alignSelf: 'flex-end',
        marginTop: 4,
        marginBottom: 28,
    },
    forgotPasswordText: {
        fontSize: 15,
        color: '#007AFF',
        fontWeight: '500',
    },
    signInButton: {
        backgroundColor: '#000',
        borderRadius: 14,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    createAccountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noAccountText: {
        fontSize: 15,
        color: '#86868B',
        marginRight: 4,
    },
    createAccountText: {
        fontSize: 15,
        color: '#007AFF',
        fontWeight: '500',
    },
});

export default LoginScreen;
