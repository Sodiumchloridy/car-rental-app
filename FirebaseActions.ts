import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDoc, getDocs } from '@react-native-firebase/firestore';
import { Booking } from './Types';

const firestoreDB = getFirestore();
const bookingsCollection = collection(firestoreDB, 'bookings');
const carsCollection = collection(firestoreDB, 'cars');

// this function is to upload user booking
export const uploadBooking = async (bookingData: Booking) => {
    try {
        const bookingRef = await addDoc(bookingsCollection, {
            ...bookingData,
            booking_date: bookingData.booking_date.toISOString(),
            start_date: bookingData.start_date.toISOString(),
            end_date: bookingData.end_date.toISOString(),
        });
        console.log(bookingData.payment);
        console.log('Booking uploaded successfully, ID:', bookingRef.id);
    } catch (error) {
        console.error('Error uploading booking:', error);
    }
};

// this function is to retrieve the latest booking of a user
export const getLatestBooking = async (userID: string) => {
    const latestBookingQuery = query(
        bookingsCollection,
        where('user_id', '==', userID),
        orderBy('booking_date', 'desc'),
        limit(1)
    );

    const latestBooking = await getDocs(latestBookingQuery);

    if (!latestBooking.empty) {
        const doc = latestBooking.docs[0];
        console.log("Recent Booking: ", doc.id, doc.data());
        return { booking_id: doc.id, ...doc.data() };
    } else {
        console.log('No latest booking found');
        return null;
    }
}

// a function that adjust the availability of a car after a booking is placed
export const changeAvailability = async () => {

}