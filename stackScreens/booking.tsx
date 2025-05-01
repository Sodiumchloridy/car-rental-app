import React, { useEffect, useState } from 'react'
import { Text, View, TouchableNativeFeedback, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import { DisplayWithLabel, InputWithLabel, ReturnButton } from '../UI';
import { useUser } from '../UserContext';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';


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
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={24} color="white" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => setOpenPicker(true)}>
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

const Booking = ({ route, navigation }: any) => {
    const { car } = route.params;
    const { user, setUser } = useUser();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    // const [openPicker, setOpenPicker] = useState(false);
    const [totalDays, setTotalDays] = useState('');
    const [totalPrice, setTotalPrice] = useState('0');

    const [renterName, setRenterName] = useState(user ? user.name : '');
    const [renterIC, setRenterIC] = useState(user ? user.ic : '');
    const [renterPhoneNo, setRenterPhoneNo] = useState(user ? user.phone_no : '');
    const [renterEmail, setRenterEmail] = useState(user ? user.email : '');

    // const openDatePicker = () => {
    //     setOpenPicker(true);
    // }

    // const onDateSelected = (event: DateTimePickerEvent, value: any) => {
    //     setStartDate(value);
    //     setOpenPicker(false);
    // }

    // for testing autofill purpose
    useEffect(() => {
        // if (!user) {
        //     setUser({
        //         id: 'user01',
        //         name: 'Raymond',
        //         email: 'asdkj@1gmail.com',
        //         ic: '040920-08-0151',
        //         phone_no: '018-9543206',
        //     });
        // }
        if (car) {
            setTotalPrice(car.price);
        }
        const days = countDays({ startDate, endDate });
        setTotalDays(days.toString());
        setTotalPrice(countTotalPrice(days.toString(), car.price).toString());
    }, [startDate, endDate]);

    return (
        <View style={{ flex: 1 }}>
            <ReturnButton color='lightgrey' />
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
            <ScrollView
                bounces={false}
                alwaysBounceVertical={false}
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
                keyboardShouldPersistTaps="handled"
                style={{
                    flex: 1,
                }}
            >
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#000', marginLeft: 10, marginTop: 60 }}>
                    Booking Details
                </Text>
                <View style={{
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
                }}>
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
                        onSelectDate={(date) => {
                            setStartDate(date);
                        }}
                        minDate={new Date()}
                    />
                    <DateSelectorCard
                        label="End Date"
                        date={endDate}
                        onSelectDate={(date) => {
                            setEndDate(date);
                        }}
                        minDate={startDate}
                    />
                    <DisplayWithLabel
                        label={'Total Days: '}
                        displayText={totalDays}
                    />
                </View>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#000', marginLeft: 10, marginTop: 20 }}>
                    Renter Details
                </Text>
                <View style={{
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
                }}>
                    <InputWithLabel
                        label="Name: "
                        orientation="horizontal"
                        value={renterName}
                        onChangeText={setRenterName}
                        placeholder="Enter your name"
                        color={isValidName(renterName) ? 'black' : 'red'}
                    /><InputWithLabel
                        label="IC: "
                        orientation="horizontal"
                        value={renterIC}
                        onChangeText={setRenterIC}
                        placeholder="000000-00-0000"
                        keyboardType="numeric"
                        color={isValidIC(renterIC) ? 'black' : 'red'}
                    /><InputWithLabel
                        label="Phone No.: "
                        orientation="horizontal"
                        value={renterPhoneNo}
                        onChangeText={setRenterPhoneNo}
                        placeholder="012-3456789"
                        keyboardType="phone-pad"
                        color={isValidPhone(renterPhoneNo) ? 'black' : 'red'}
                    /><InputWithLabel
                        label="Email: "
                        orientation="horizontal"
                        value={renterEmail}
                        onChangeText={setRenterEmail}
                        placeholder="abc@gmail.com"
                        keyboardType="email-address"
                        color={isValidEmail(renterEmail) ? 'black' : 'red'}
                    />
                </View>
            </ScrollView>
            {/* bottom part container */}
            <View style={{
                height: height * 0.12,
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
            }}>
                {/* Total price container */}
                <View>
                    <Text style={{
                        fontSize: 14,
                        color: 'rgba(0,0,0,0.4)',
                        left: '5%',
                    }}>
                        Total Price:
                    </Text>
                    <Text style={{
                        fontSize: 28,
                        fontWeight: 'bold',
                        lineHeight: 28,
                        color: '#000',
                        paddingTop: 5,
                        left: '12%',
                    }}>
                        RM {totalPrice}
                    </Text>
                </View>

                <TouchableNativeFeedback
                    onPress={() => {
                        console.log('confirm booking pressed')
                    }}
                >
                    <View style={{
                        backgroundColor: '#00b14f',
                        paddingHorizontal: 30,
                        paddingVertical: 12,
                        borderRadius: 30,
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '48%'
                    }}>
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 16,
                                textAlign: 'center',
                                flexWrap: 'wrap',
                                width: '100%',
                            }}
                        >
                            Confirm Booking
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    );
}

export default Booking;

const styles = StyleSheet.create({
    container: {
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
    iconContainer: {
        backgroundColor: '#000',
        borderRadius: 30,
        padding: 10,
        marginRight: 15,
    },
    label: {
        color: '#666',
        fontSize: 14,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        marginTop: 4,
    },
    editButton: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 30,
        padding: 10,
    },
});