import React, { useEffect, useState } from 'react'
import { Text, View, TouchableNativeFeedback, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { DisplayWithLabel, ReturnButton } from '../UI';
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


const Booking = ({ route, navigation }: any) => {
    const { car } = route.params;
    const { user, setUser } = useUser();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openPicker, setOpenPicker] = useState(false);


    const openDatePicker = () => {
        setOpenPicker(true);
    }

    const onDateSelected = (event: DateTimePickerEvent, value: any) => {
        setStartDate(value);
        setOpenPicker(false);
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
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <ReturnButton />
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
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#000', marginLeft: 10, marginTop: 60 }}>
                Make Booking
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
            </View>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#000', marginLeft: 10, marginTop: 20 }}>
                Renter Details
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

            </View>
            <View style={{ padding: 20 }}>
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