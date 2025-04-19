import React, { useState, useEffect } from 'react'
import { Text, FlatList, View, Image, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
// import firestore from '@react-native-firebase/firestore';
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

const db = SQLite.openDatabase({ name: 'carRental.db', location: 'default' });

interface Car {
    id: string;
    model: string;
    price: number;
    image?: string;
    category: string;
    availability: number;
    description?: string;
    fuel_type?: string;
    mileage?: number;
}

const CarCard = ({ item }: { item: Car }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.model}>{item.model}</Text>
            <Text style={styles.price}>Price per Day: RM {item.price}</Text>
            <Image source={{ uri: item.image }} style={styles.image} />
        </View>
    )
}



const SedanList = () => {
    const [cars, setCars] = useState<Car[]>([]);

    // initialize the cars table
    const _createCarsTable = () => {
        try {
            db.transaction((tx: any) => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS cars (
                    id INTEGER PRIMARY KEY,
                    model TEXT NOT NULL,
                    price REAL NOT NULL,
                    image TEXT,
                    category TEXT NOT NULL,
                    availability INTEGER DEFAULT 1,
                    description TEXT,
                    fuel_type TEXT,
                    mileage REAL
                    )`
                );
            })
        } catch (error) {
            console.error(error);
            throw Error('Failed to create cars Table');
        }
    }


    // retrieve cars data from Firestore
    const _fetchFromFirestore = async (): Promise<Car[]> => {
        try {
            const firestoreDB = getFirestore();
            const carsRef = collection(firestoreDB, 'cars');
            const sedanQuery = query(carsRef, where('category', '==', 'Sedan'));
            const snapshot = await getDocs(sedanQuery);
            const carData: Car[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                model: doc.data().model as string,
                price: doc.data().price as number,
                image: doc.data().image as string | undefined,
                category: doc.data().category as string,
                availability: doc.data().availability as number,
                description: doc.data().description as string | undefined,
                fuel_type: doc.data().fuel_type as string | undefined,
                mileage: doc.data().mileage as number | undefined,
            }));
            return carData;
        } catch (error) {
            console.error('Firestore fetch error:', error);
            throw error;
        }
    };

    // Sync Firestore data to SQLite
    const _syncToSQLite = (carData: Car[]) => {
        db.transaction((tx: any) => {
            carData.forEach((car: Car) => {
                tx.executeSql(
                    `INSERT OR REPLACE INTO cars (id, model, price, image, category, availability, description, fuel_type, mileage)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        car.id,
                        car.model,
                        car.price,
                        car.image,
                        car.category,
                        car.availability,
                        car.description,
                        car.fuel_type,
                        car.mileage,
                    ],
                    () => { },
                    (error: any) => console.error('Error syncing car to SQLite:', error)
                );
            });
        });
    };

    // Fetch cars from SQLite (offline fallback)
    const _fetchFromSQLite = async (): Promise<Car[]> => {
        return new Promise((resolve, reject) => {
            db.transaction((tx: any) => {
                tx.executeSql(
                    'SELECT * FROM cars WHERE category = ?',
                    ['Sedan'],
                    (tx: any, results: any) => {
                        const rows = results.rows;
                        let offlineCars: Car[] = [];
                        for (let i = 0; i < rows.length; i++) {
                            offlineCars.push(rows.item(i));
                        }
                        resolve(offlineCars);
                    },
                    (error: any) => {
                        console.error('SQLite fetch error:', error);
                        reject(error);
                    }
                );
            });
        });
    };

    // Main fetch logic
    const _fetchCars = async () => {
        try {
            const carData: Car[] = await _fetchFromFirestore();
            setCars(carData);
            _syncToSQLite(carData);
        } catch (error) {
            const offlineCars: Car[] = await _fetchFromSQLite();
            setCars(offlineCars);
        }
    };

    useEffect(() => {
        _createCarsTable();
        _fetchCars();
    }, []);

    return (
        <View>
            <FlatList
                data={cars}
                renderItem={({ item }: { item: Car }) => (
                    <CarCard item={item} />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    columnWrapper: {
        justifyContent: 'space-between',  // This ensures the two columns are spaced out evenly
        marginBottom: 10,  // Optional: adds spacing between rows
    },
    card: {
        flex: 0.48,  // Ensure that each card takes approximately half the width
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    model: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    price: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: 120,  // Adjusted for a better fit
        borderRadius: 5,
        marginTop: 10,
    },
});

export default SedanList;