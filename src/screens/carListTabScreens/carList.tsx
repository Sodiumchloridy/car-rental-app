import React, { useState, useEffect } from 'react'
import { Text, FlatList, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
//import SQLite from 'react-native-sqlite-storage';
let SQLite = require('react-native-sqlite-storage');
// import firestore from '@react-native-firebase/firestore';
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import { CarCard } from '@/components/UI';
import { Car } from '../../types/Types';
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { DrawerParamList } from '../../types/Types';


const db = SQLite.openDatabase({ name: 'carRental.db', location: 'default' });

type Props = {
    category: 'SUV' | 'Sedan' | 'Luxury';
}


const carList = ({ category }: Props) => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
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
            const sedanQuery = query(carsRef, where('category', '==', category));
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
                    [category],
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
        <View style={{ flex: 1 }}>
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu-outline" size={28} color="#000" />
                </TouchableOpacity>
            </View>
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

export default carList;
