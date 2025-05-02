import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from '@react-native-firebase/firestore';
import { Booking } from './Types';

const firestoreDB = getFirestore();
const bookingsCollection = collection(firestoreDB, 'bookings');

export const uploadBooking = async (bookingData: Booking) => {
    try {
        const bookingRef = await addDoc(bookingsCollection, {
            ...bookingData,
            start_date: bookingData.start_date.toISOString(),
            end_date: bookingData.end_date.toISOString(),
        });
        console.log(bookingData.payment);
        console.log('Booking uploaded successfully, ID:', bookingRef.id);
    } catch (error) {
        console.error('Error uploading booking:', error);
    }
};