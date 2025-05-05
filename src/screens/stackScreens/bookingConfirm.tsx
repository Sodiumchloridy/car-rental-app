import React, { useEffect, useState } from 'react'
import { Text, View, TouchableNativeFeedback, Button, TouchableOpacity, ScrollView, StyleSheet, BackHandler } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { DisplayWithLabel } from '@/components/UI';
import { getCar } from '../../utils/FirebaseActions';
import { Car } from '../../types/Types';


const BookingConfirmPage = ({ route, navigation }: any) => {
    const { bookingID, bookingData } = route.params;
    const [car, setCar] = useState<Car>();

    useEffect(() => {
        const fetchCar = async (carID: string) => {
            const result = await getCar(carID);
            if (result) {
                setCar(result);
            }
        };

        fetchCar(bookingData.car_id);
    }, [])

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Home');
            return true; // prevent default back action
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

    }, [navigation])

    return (
        <ScrollView
            bounces={false}
            alwaysBounceVertical={false}
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'flex-start',
            }}
            keyboardShouldPersistTaps="handled"
            style={styles.scrollView}
        >
            <View style={{ alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={70} color="#63d46c" />
                <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', marginVertical: 8 }}>
                    Your Booking is Confirmed!
                </Text>
                <Text style={{ color: 'black', fontSize: 30, fontWeight: 'bold', marginBottom: 5 }}>
                    RM {isNaN(parseFloat(bookingData.price)) ? 'NaN' : parseFloat(bookingData.price).toFixed(2)}
                </Text>
                <Text style={{ color: 'rgba(0,0,0,0.5)', fontSize: 16 }}>
                    Paid
                </Text>
            </View>
            <View style={styles.detailsCard}>
                <DisplayWithLabel
                    label={'Car Booked: '}
                    displayText={car?.model ?? 'Not found'}
                    size={18}
                />
                <DisplayWithLabel
                    label={'Transaction Type: '}
                    displayText={bookingData.payment}
                    size={18}
                />
                <DisplayWithLabel
                    label={'Booking ID: '}
                    displayText={bookingID}
                    size={18}
                />
                <DisplayWithLabel
                    label={'Booked at: '}
                    displayText={bookingData?.booking_date}
                    size={18}
                />
                <DisplayWithLabel
                    label={'Renter Name: '}
                    displayText={bookingData?.renter.name}
                    size={18}
                />
                <DisplayWithLabel
                    label={'Renter IC: '}
                    displayText={bookingData?.renter.ic}
                    size={18}
                />
                <DisplayWithLabel
                    label={'Renter Phone: '}
                    displayText={bookingData.renter.phone_no}
                    size={18}
                />
                <DisplayWithLabel
                    label={'Renter Email: '}
                    displayText={bookingData.renter.email}
                    size={18}
                />
                <DisplayWithLabel
                    label={'Start Date: '}
                    displayText={bookingData.start_date}
                    size={18}
                />
                <DisplayWithLabel
                    label={'End Date: '}
                    displayText={bookingData.end_date}
                    size={18}
                />
            </View>
            {/* home button and booking history button */}
            <View style={{ marginTop: 25, alignItems: 'center', marginBottom: 50 }}>
                <TouchableNativeFeedback onPress={() => console.log('booking history button pressed')}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>
                            Booking History
                        </Text>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => navigation.navigate('Home')}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>
                            Return to Home
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </ScrollView>
    );
}

export default BookingConfirmPage;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        // backgroundColor: 'white'
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