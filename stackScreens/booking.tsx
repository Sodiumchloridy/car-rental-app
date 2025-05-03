import React, { useEffect, useState } from 'react'
import { Text, View, TouchableNativeFeedback, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions, Alert, Image } from 'react-native';
import { DisplayWithLabel, InputWithLabel, ReturnButton } from '../UI';
import { useUser } from '../UserContext';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { uploadBooking, getLatestBooking } from '../FirebaseActions';
import { Booking } from '../Types';

const paymentMethods = [
    { name: 'FPX', icon: require('../images/fpx.png') },
    { name: 'Touch \'n Go', icon: require('../images/tng.png') },
    { name: 'GrabPay', icon: require('../images/grabpay.png') },
    { name: 'DuitNow', icon: require('../images/duitnow.png') },
];

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};


const DateSelectorCard = ({ label, date, minDate, onSelectDate }: { label: string; date: Date; minDate: Date; onSelectDate: (newDate: Date) => void }) => {
    const [openPicker, setOpenPicker] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        setOpenPicker(false);
        if (selectedDate) {
            onSelectDate(selectedDate);
        }
    };

    return (
        <View style={styles.dateCardContainer}>
            <View style={styles.dateCardIcon}>
                <Ionicons name="calendar" size={24} color="white" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.dateCardLabel}>{label}</Text>
                <Text style={styles.dateCardText}>{formatDate(date)}</Text>
            </View>
            <TouchableOpacity
                style={styles.dateCardEditButton}
                onPress={() => setOpenPicker(true)}
            >
                <Feather name="edit" size={24} color="white" />
            </TouchableOpacity>

            {openPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    onChange={onChange}
                    minimumDate={minDate}
                />
            )}
        </View>
    );
};

const countDays = ({ startDate, endDate }: { startDate: Date, endDate: Date }) => {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    if (end >= start) {
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    } else {
        return '';
    }
}

const countTotalPrice = (totalDays: string, pricePerDay: string) => {
    // return 2 decimal place
    const days = Number.parseInt(totalDays);
    const price = Number.parseFloat(pricePerDay);
    return Math.round(days * price * 100) / 100;
}

const isValidName = (name: string) => /^[a-zA-Z\s]+$/.test(name);
const isValidIC = (ic: string) => /^\d{6}-\d{2}-\d{4}$/.test(ic);
const isValidPhone = (phone: string) => /^01\d-\d{7,8}$/.test(phone);
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const { height } = Dimensions.get('window');

const BookingScreen = ({ route, navigation }: any) => {
    const { car } = route.params;
    const { user, setUser } = useUser();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [totalDays, setTotalDays] = useState('');
    const [totalPrice, setTotalPrice] = useState('0');

    const [renterName, setRenterName] = useState(user ? user.name : '');
    const [renterIC, setRenterIC] = useState(user ? user.ic : '');
    const [renterPhoneNo, setRenterPhoneNo] = useState(user ? user.phone_no : '');
    const [renterEmail, setRenterEmail] = useState(user ? user.email : '');

    const [paymentMethod, setPaymentMethod] = useState('FPX');

    const submitBooking = () => {
        if (isValidName(renterName) && isValidIC(renterIC) && isValidPhone(renterPhoneNo) && isValidEmail(renterEmail) && !isNaN(Number(totalPrice))) {
            const booking: Booking = {
                car_id: car.id,
                user_id: user.id,
                start_date: startDate,
                end_date: endDate,
                booking_date: new Date(),
                price: totalPrice,
                payment: paymentMethod,
                renter: {
                    name: renterName,
                    email: renterEmail,
                    ic: renterIC,
                    phone_no: renterPhoneNo,
                }
            }
            uploadBooking(booking);
            getLatestBooking(user.id);
        } else {
            if (!isValidName(renterName)) {
                Alert.alert(
                    "Invalid Name",
                    "Please enter a valid name (letters only)",
                    [{ text: "OK" }]
                );
                return;
            } else if (!isValidIC(renterIC)) {
                Alert.alert(
                    "Invalid IC",
                    "Please enter a valid IC (digits and - only)\nFormat: XXXXXX-XX-XXXX",
                    [{ text: "OK" }]
                );
                return;
            } else if (!isValidPhone(renterPhoneNo)) {
                Alert.alert(
                    "Invalid Phone Number",
                    "Please enter a valid Phone Number (digits and - only)\nFormat: XXX-XXXXXXX",
                    [{ text: "OK" }]
                );
                return;
            } else if (!isValidEmail(renterEmail)){
                Alert.alert(
                    "Invalid Email",
                    "Please enter a valid Email\nFormat: X@mail.com",
                    [{ text: "OK" }]
                );
            } else {
                Alert.alert(
                    "Invalid Date Period chosen",
                    "Please provide a valid Date period",
                    [{ text: "OK" }]
                );
            }
        }
    }

    // for testing autofill purpose
    useEffect(() => {
        if (!user) {
            setUser({
                id: 'user01',
                name: 'Raymond',
                email: 'asdkj@1gmail.com',
                ic: '040920-08-0151',
                phone_no: '018-9543206',
            });
        }
        if (car) {
            setTotalPrice(car.price);
        }
        const days = countDays({ startDate, endDate });
        setTotalDays(days.toString());
        setTotalPrice(countTotalPrice(days.toString(), car.price).toString());
    }, [startDate, endDate]);

    return (
        <View style={styles.screenContainer}>
            <ReturnButton color='lightgrey' />
            <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                style={styles.gradientHeader}
                locations={[0, 0.8]}
            />
            <ScrollView
                bounces={false}
                alwaysBounceVertical={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
                keyboardShouldPersistTaps="handled"
                style={styles.scrollView}
            >
                <Text style={styles.sectionHeader}>
                    Booking Details
                </Text>
                <View style={styles.detailsCard}>
                    <DisplayWithLabel
                        label={'Car Selected: '}
                        displayText={car.model}
                    />
                    <DisplayWithLabel
                        label={'Rental per day: '}
                        displayText={'RM ' + car.price}
                        size={16}
                    />
                    <DateSelectorCard
                        label="Start Date"
                        date={startDate}
                        onSelectDate={(date) => setStartDate(date)}
                        minDate={new Date()}
                    />
                    <DateSelectorCard
                        label="End Date"
                        date={endDate}
                        onSelectDate={(date) => setEndDate(date)}
                        minDate={startDate}
                    />
                    <DisplayWithLabel
                        label={'Total Days: '}
                        displayText={totalDays}
                    />
                </View>
                <Text style={styles.renterDetailsHeader}>
                    Renter Details
                </Text>
                <View style={styles.renterDetailsCard}>
                    <InputWithLabel
                        label="Name: "
                        orientation="horizontal"
                        value={renterName}
                        onChangeText={setRenterName}
                        placeholder="Enter your name"
                        color={isValidName(renterName) ? 'black' : 'red'}
                    />
                    <InputWithLabel
                        label="IC: "
                        orientation="horizontal"
                        value={renterIC}
                        onChangeText={setRenterIC}
                        placeholder="000000-00-0000"
                        keyboardType="numeric"
                        color={isValidIC(renterIC) ? 'black' : 'red'}
                    />
                    <InputWithLabel
                        label="Phone No.: "
                        orientation="horizontal"
                        value={renterPhoneNo}
                        onChangeText={setRenterPhoneNo}
                        placeholder="012-3456789"
                        keyboardType="phone-pad"
                        color={isValidPhone(renterPhoneNo) ? 'black' : 'red'}
                    />
                    <InputWithLabel
                        label="Email: "
                        orientation="horizontal"
                        value={renterEmail}
                        onChangeText={setRenterEmail}
                        placeholder="abc@gmail.com"
                        keyboardType="email-address"
                        color={isValidEmail(renterEmail) ? 'black' : 'red'}
                    />
                </View>
                <Text style={styles.renterDetailsHeader}>
                    Payment method:
                </Text>
                <View style={[styles.renterDetailsCard, { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }]}>
                    {paymentMethods.map((method, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {setPaymentMethod(method.name);
                                console.log(method.name);
                                
                            }}
                            style={{
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: paymentMethod === method.name ? '#00b14f': 'white',
                                borderRadius: 10,
                                padding: 5,
                            }}
                        >
                            <View key={index} style={{ alignItems: 'center' }}>
                                <Image
                                    source={method.icon}
                                    style={{ width: 50, height: 50, resizeMode: 'contain', backgroundColor: 'white' }}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.footerContainer}>
                <View>
                    <Text style={styles.totalPriceLabel}>Total Price:</Text>
                    <Text style={styles.totalPriceValue}>RM {totalPrice}</Text>
                </View>
                <TouchableNativeFeedback onPress={submitBooking}>
                    <View style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    );
}

export default BookingScreen;

const styles = StyleSheet.create({
    // Main container styles
    screenContainer: {
        flex: 1,
    },
    gradientHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 100,
    },
    scrollView: {
        flex: 1,
    },

    // Section header styles
    sectionHeader: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 10,
        marginTop: 60,
    },
    renterDetailsHeader: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 10,
        marginTop: 20,
    },

    // Card container styles
    detailsCard: {
        marginTop: 20,
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    renterDetailsCard: {
        marginTop: 20,
        marginBottom: 15,
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },

    // Footer styles
    footerContainer: {
        height: Dimensions.get('window').height * 0.12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    totalPriceLabel: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.4)',
        left: '5%',
    },
    totalPriceValue: {
        fontSize: 28,
        fontWeight: 'bold',
        lineHeight: 28,
        color: '#000',
        paddingTop: 5,
        left: '12%',
    },
    confirmButton: {
        backgroundColor: '#00b14f',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        width: '48%'
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        flexWrap: 'wrap',
        width: '100%',
    },

    // Date selector card styles
    dateCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
        marginVertical: 10,
    },
    dateCardIcon: {
        backgroundColor: '#000',
        borderRadius: 30,
        padding: 10,
        marginRight: 15,
    },
    dateCardLabel: {
        color: '#666',
        fontSize: 14,
    },
    dateCardText: {
        fontSize: 16,
        color: '#333',
        marginTop: 4,
    },
    dateCardEditButton: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 30,
        padding: 10,
    },
});