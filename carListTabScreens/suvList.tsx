import React, { useState, useEffect } from 'react'
import { FlatList, View, StyleSheet } from 'react-native';
let SQLite = require('react-native-sqlite-storage');
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { CarCard } from '../UI';
import { Car } from '../Types';

const db = SQLite.openDatabase({ name: 'carRental.db', location: 'default' });

const SuvList = () => {
    const [cars, setCars] = useState<Car[]>([]);

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

    const _fetchFromFirestore = async (): Promise<Car[]> => {
        try {
            const firestoreDB = getFirestore();
            const carsRef = collection(firestoreDB, 'cars');
            const suvQuery = query(carsRef, where('category', '==', 'SUV'));
            const snapshot = await getDocs(suvQuery);
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
                    ]
                );
            });
        });
    };

    const _fetchFromSQLite = async (): Promise<Car[]> => {
            return new Promise((resolve, reject) => {
                db.transaction((tx: any) => {
                    tx.executeSql(
                        'SELECT * FROM cars WHERE category = ?',
                        ['SUV'],
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
        <View style={{ flex: 1 }}>
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
        justifyContent: 'space-between',
        marginTop: 10,
    },
})

export default SuvList;