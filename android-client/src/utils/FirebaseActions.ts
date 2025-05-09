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

        if (carData.exists) {
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
        if (carData.exists) {
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

/**
 * Function to add a car listing to Firestore
 * @param {CarListing} car - The car listing object to be added
 * @returns {Promise<boolean>} - Returns true if the car listing was added successfully, false otherwise
 * @throws {Error} - Throws an error if there was an issue adding the car listing
 */
interface CarListing {
    model: string;
    price: number;
    image?: string;
    category: string;
    availability: number;
    description?: string;
    fuel_type?: string;
    mileage?: number;
    owner_name: string;
    owner_uuid: string;
}

export const addCarListing = async (car: CarListing) => {
    try {
        console.log('[FirebaseActions] Attempting addDoc to carsCollection...');
        const carRef = await addDoc(carsCollection, car);
        console.log('[FirebaseActions] addDoc successful. Car listing added, ID:', carRef.id);
        return true;
    } catch (error) {
        console.error('[FirebaseActions] Error in addDoc during addCarListing:', error);
        return false;
    }
}

/**
 * Fetches the booking history for a specific user from Firestore.
 * 
 * @param user_uuid - The UUID of the user whose booking history is to be fetched
 * @returns A promise that resolves to an array of Booking objects with their IDs
 * @throws Will throw an error if the Firestore fetch operation fails
 * 
 * @example
 * ```typescript
 * try {
 *   const bookingHistory = await fetchBookingHistory('user-uuid');
 *   console.log(bookingHistory);
 * } catch (error) {
 *   console.error('Failed to fetch booking history:', error);
 * }
 * ```
 */
type BookingWithId = Booking & { id: string };
export const fetchBookingHistory = async (user_uuid: string): Promise<BookingWithId[]> => {
    try {
        // Replace the old namespaced query with the modular API
        const bookingsQuery = query(
            bookingsCollection, // This constant is already defined using the modular API
            where('user_id', '==', user_uuid),
            orderBy('booking_date', 'desc')
        );
        const snapshot = await getDocs(bookingsQuery);

        const bookingData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as BookingWithId[];

        return bookingData;
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
};


/**
 * Fetches cars from Firestore database based on the specified category.
 * 
 * @param category - The category of cars to fetch (e.g., 'sedan', 'suv', etc.)
 * @returns A promise that resolves to an array of Car objects
 * @throws Will throw an error if the Firestore fetch operation fails
 * 
 * @example
 * ```typescript
 * try {
 *   const sedanCars = await fetchCars('sedan');
 *   console.log(sedanCars);
 * } catch (error) {
 *   console.error('Failed to fetch cars:', error);
 * }
 * ```
 */
export const fetchCars = async (category: String): Promise<Car[]> => {
    try {
        const firestoreDB = getFirestore();
        const carsRef = collection(firestoreDB, 'cars');
        const sedanQuery = query(carsRef, where('category', '==', category));
        const snapshot = await getDocs(sedanQuery);
        const carData: Car[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                model: data.model as string,
                price: data.price as number,
                image: data.image as string | undefined,
                category: data.category as string,
                availability: data.availability,
                description: data.description as string | undefined,
                fuel_type: data.fuel_type as string | undefined,
                mileage: data.mileage as number | undefined,
                owner_name: data.owner_name as string,
                owner_uuid: data.owner_uuid as string,
            };
        });
        return carData;
    } catch (error) {
        console.error('Firestore fetch error:', error);
        throw error;
    }
};