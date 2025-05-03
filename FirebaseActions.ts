import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDoc, getDocs, doc, updateDoc } from '@react-native-firebase/firestore';
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
        changeAvailability(bookingData.car_id, bookingData.start_date, bookingData.end_date, false);
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
export const changeAvailability = async (carID: string, start_date: Date, end_date: Date, isAvailable: boolean) => {
    try {
        // search car based on carID
        const carSelected = doc(carsCollection, carID);
        // get current car data
        const carData = await getDoc(carSelected);

        if (carData.exists) {
            const available_date = new Date(end_date);
            available_date.setDate(available_date.getDate() + 1);
            available_date.setUTCHours(0, 0, 0, 0);
            await updateDoc(carSelected, {
                availability: isAvailable ? 'yes' : 'booked',
                unavailable_from: isAvailable ? null : start_date.toISOString(),
                unavailable_until: isAvailable ? null : available_date.toISOString(),
            })
            console.log(`Car availability updated: ${carID}, Availability: ${isAvailable}`)
        } else {
            console.log(`Car id: ${carID} not found`);
        }

    } catch (error) {
        console.error('Error updating car availability:', error);
    }
}