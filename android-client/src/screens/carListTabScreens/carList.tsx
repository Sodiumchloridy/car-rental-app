import React, { useState, useEffect } from 'react'
import { Text, FlatList, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
let SQLite = require('react-native-sqlite-storage');
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { CarCard } from '@/components/UI';
import { Car } from '../../types/Types';
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { DrawerParamList } from '../../types/Types';
import { useTheme } from 'react-native-paper';


const db = SQLite.openDatabase({ name: 'carRental.db', location: 'default' });

type Props = {
    category: 'SUV' | 'Sedan' | 'Luxury';
}


const carList = ({ category }: Props) => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
    const [cars, setCars] = useState<Car[]>([]);
    const theme = useTheme();

    // initialize the cars table
    const _createCarsTable = () => {
        try {
            db.transaction((tx: any) => {
                tx.executeSql('DROP TABLE IF EXISTS cars');

                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS cars (
                    id TEXT PRIMARY KEY,
                    model TEXT NOT NULL,
                    price REAL NOT NULL,
                    image TEXT,
                    category TEXT NOT NULL,
                    availability INTEGER DEFAULT 1,
                    description TEXT,
                    fuel_type TEXT,
                    mileage REAL,
                    owner_name TEXT NOT NULL
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
                    owner_name: (data.owner_name as string) || '',
                };
            });
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
                    `INSERT OR REPLACE INTO cars (id, model, price, image, category, availability, description, fuel_type, mileage, owner_name)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        car.id,
                        car.model,
                        car.price,
                        car.image,
                        car.category,
                        car.availability ? 1 : 0,
                        car.description,
                        car.fuel_type,
                        car.mileage,
                        car.owner_name,
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
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu-outline" size={28} color={theme.colors.text} />
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
