import { ReturnButton } from '@/components/UI';
import { useUser } from '@/context/UserContext';
import { deleteCarListing } from '@/utils/FirebaseActions';
import React from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

// use Dimensions to get the height of screen
const { height } = Dimensions.get('window');

const CarDetail = ({ route, navigation }: any) => {
    const { car } = route.params;
    const { user } = useUser();
    const isOwner = user?.uuid === car.owner_uuid;

    const generateChatId = (userId1: string, userId2: string): string => {
        return [userId1, userId2].sort().join('_');
    };

    // pass car.owner_uuid to create unique chatId and join user into a chatroom between owner
    const chatHandling = (owner_id: string, owner_name: string) => {
        if (user) {
            const chatId = generateChatId(user.uuid, owner_id);
            navigation.navigate('Chatroom', { chatId: chatId, ownerId: owner_id, userId: user?.uuid, userName: owner_name })
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}>
            {/* return button */}
            <ReturnButton color='lightgrey' />

            {/* car image container */}
            <View style={{ height: height * 0.48 }}>
                <Image source={{ uri: car.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                {/* two LinearGradient are used to add a effect of shadow overlay on top and bottom of car image */}
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
            <View style={styles.carDetailContainer}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
                    {car.model}
                </Text>

                <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: 'rgba(0,0,0,0.5)', }}>
                        Owner: {car.owner_name}
                    </Text>
                    {user?.uuid !== car.owner_uuid && (

                        <TouchableOpacity onPress={() => chatHandling(car.owner_uuid, car.owner_name)} style={{ marginLeft: '5%' }}>
                            <Ionicons name="chatbubble-ellipses" size={28} color={'#00b14f'} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Update and Delete Buttons */}
                {isOwner && (
                    <View style={{ flexDirection: 'row', marginTop: 20, paddingBottom: 20 }}>
                        <TouchableNativeFeedback onPress={() => {
                            navigation.navigate('UpdateCar', { car: car });
                        }}>
                            <View style={{
                                backgroundColor: '#1877F2',
                                marginRight: 10,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: 5,
                            }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                    Update
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPress={async () => {
                            if (await deleteCarListing(car.id)) {
                                Alert.alert('Success', 'Car listing deleted successfully');
                                navigation.navigate('Home');
                            } else {
                                Alert.alert('Error', 'Failed to delete car listing');
                            }
                        }}>
                            <View style={{
                                backgroundColor: 'red',
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: 5,
                            }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                    Delete
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                )}


                {/* vertical scrollable */}
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: height * 0.2,
                    }}
                >
                    {/* car description display */}
                    <Text style={{ marginTop: 18, fontSize: 22, fontWeight: 'bold', color: '#000' }}>
                        Description:
                    </Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: 'rgba(0,0,0,0.6)' }}>
                        {car.description}
                    </Text>

                    {/* technical specification display */}
                    <Text style={{ marginTop: 18, fontSize: 22, fontWeight: 'bold', color: '#000' }}>
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
                </ScrollView>
            </View >

            {/* Booking price and button */}
            < View style={styles.bookingButtonContainer} >
                {/* price */}
                < View style={{
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
                </View >
                {/* booking button */}
                < View style={{
                    width: '48%',
                }}>
                    {(user?.uuid !== car.owner_uuid && car.availability === 'yes') && (
                        <TouchableNativeFeedback
                            onPress={() => {
                                navigation.navigate('Booking', { car: car });
                            }}
                        >
                            <View style={styles.bookNowButton}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                    Book Now
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    )}
                </View >
            </View >
        </View >
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
    carDetailContainer: {
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
    },
    bookingButtonContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.12,
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderBottomWidth: 0,
        paddingTop: 10,
        paddingLeft: 10,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    bookNowButton: {
        backgroundColor: '#000',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CarDetail;