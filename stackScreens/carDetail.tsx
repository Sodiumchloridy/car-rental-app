import React from 'react'
import { Text, View, Image, Dimensions, StyleSheet, ScrollView, TouchableNativeFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { height } = Dimensions.get('window');

const App = ({ route, navigation }: any) => {
    const { car } = route.params;
    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
            <View style={{ height: height * 0.48 }}>
                <Image source={{ uri: car.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                {/* Top Gradient */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 100,
                    }}
                    locations={[0, 0.8]}
                />
                {/* Bottom Gradient */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 100,
                    }}
                />
            </View>

            {/* the car detail container */}
            <View style={{
                position: 'absolute',
                top: height * 0.45,
                left: 0,
                right: 0,
                height: height * 0.58,
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                zIndex: 1
            }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
                    {car.model}
                </Text>
                <Text style={{ marginTop: 5, fontSize: 14, color: 'rgba(0,0,0,0.5)', }}>
                    Owner: Mr.White
                    {/* this one can change ltr */}
                </Text>
                <Text style={{ marginTop: 20, fontSize: 22, fontWeight: 'bold', color: '#000' }}>
                    Technical Specification:
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                >
                    <View style={styles.specContainer}>
                        <View style={styles.specItem}>
                            <Text style={styles.specTitle}>Category: </Text>
                            <Text style={styles.specText}>{car.category}</Text>
                        </View>
                        <View style={styles.specItem}>
                            <Text style={styles.specTitle}>Availability: </Text>
                            <Text style={styles.specText}>{car.availability}</Text>
                        </View>
                        <View style={styles.specItem}>
                            <Text style={styles.specTitle}>Fuel: </Text>
                            <Text style={styles.specText}>{car.fuel_type}</Text>
                        </View>
                        <View style={styles.specItem}>
                            <Text style={styles.specTitle}>Mileage: </Text>
                            <Text style={styles.specText}>{car.mileage}</Text>
                        </View>
                    </View>
                </ScrollView>

            </View>
            {/* Booking price and button */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: height * 0.12,
                borderColor: 'rgba(0,0,0,0.2)',
                borderWidth: 1,
                paddingTop: 10,
                paddingLeft: 10,
                zIndex: 1,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {/* price */}
                <View style={{
                    width: '40%',
                    marginLeft: 14,
                    marginRight: 8
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: 'rgba(0,0,0,0.4)',
                    }}>
                        from
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginBottom: 10,
                    }}>
                        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#000' }}>
                            RM{car.price}
                        </Text>
                        <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', marginLeft: 4, marginTop: 16 }}>
                            / day
                        </Text>
                    </View>
                </View>
                {/* booking button */}
                <View style={{
                    width: '48%',
                }}>
                    <TouchableNativeFeedback
                        onPress={() => {
                            // your booking action here
                            console.log('Book Now Pressed!');
                        }}
                    >
                        <View style={{
                            backgroundColor: '#000',
                            paddingHorizontal: 30,
                            paddingVertical: 12,
                            borderRadius: 30,
                            overflow: 'hidden', // Needed for ripple to stay inside rounded button
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                Book Now
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    specContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    specItem: {
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 10,
        marginRight: 15,
        borderRadius: 10,
        width: 120,
        height: 80,
        justifyContent: 'center',
        backgroundColor: 'white',
        elevation: 5,
    },
    specTitle: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.4)',
    },
    specText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left'
    },
});

export default App;