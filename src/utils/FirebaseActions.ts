import { initializeApp, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDoc, getDocs, doc, updateDoc } from '@react-native-firebase/firestore';
import { Booking, Car } from '../types/Types';
import { formatDateTime, parseDateTime } from './TimeFormating';

const firestoreDB = getFirestore();
const bookingsCollection = collection(firestoreDB, 'bookings');
const carsCollection = collection(firestoreDB, 'cars');



// this function is to upload user booking
export const uploadBooking = async (bookingData: Booking) => {
    try {
        const bookingRef = await addDoc(bookingsCollection, {
            ...bookingData,
            booking_date: bookingData.booking_date,
            start_date: bookingData.start_date,
            end_date: bookingData.end_date,
        });
        console.log(bookingData.payment);
        console.log('Booking uploaded successfully, ID:', bookingRef.id);
        changeAvailability(bookingData.car_id, bookingData.start_date, bookingData.end_date, false);
        return true;
    } catch (error) {
        console.error('Error uploading booking:', error);
        return false;
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
        const data = doc.data() as Booking;
        console.log("Recent Booking: ", doc.id, data);
        return { booking_id: doc.id, bookingData: data };
    } else {
        console.log('No latest booking found');
        return null;
    }
}

// a function that adjust the availability of a car after a booking is placed
export const changeAvailability = async (carID: string, start_date: string, end_date: string, isAvailable: boolean) => {
    try {
        // search car based on carID
        const carSelected = doc(carsCollection, carID);
        // get current car data
        const carData = await getDoc(carSelected);

        if (carData.exists()) {
            const available_date = parseDateTime(end_date);
            if (!available_date) {
                console.error('Failed to parse end_date:', end_date);
                return;
            }
            available_date.setDate(available_date.getDate() + 1);
            available_date.setHours(0, 0, 0, 0);
            await updateDoc(carSelected, {
                availability: isAvailable ? 'yes' : 'booked',
                unavailable_from: isAvailable ? null : start_date,
                unavailable_until: isAvailable ? null : formatDateTime(available_date),
            })
            console.log(`Car availability updated: ${carID}, Availability: ${isAvailable}`)
        } else {
            console.log(`Car id: ${carID} not found`);
        }

    } catch (error) {
        console.error('Error updating car availability:', error);
    }
}

// retrieve a car based on car id provided
export const getCar = async (carID: string) => {
    try {
        const carSelected = doc(carsCollection, carID);
        const carData = await getDoc(carSelected);
        if (carData.exists()) {
            const car = carData.data() as Car;
            console.log("Car id: " + carID + " is found");
            return car;
        } else {
            console.log("Car not found");
        }
    } catch (error) {
        console.log("Error when retrieving car: " + error)
    }
}