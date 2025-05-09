import React, { useState, useEffect } from 'react'
import { Text, FlatList, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
let SQLite = require('react-native-sqlite-storage');
import { CarCard } from '@/components/CarCard';
import { Car } from '../../types/Types';
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { DrawerParamList } from '../../types/Types';
import { useTheme } from 'react-native-paper';
import { fetchCars } from '@/utils/FirebaseActions';

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
                    owner_name TEXT NOT NULL,
                    owner_uuid TEXT NOT NULL,
                    )`
                );
            })
        } catch (error) {
            console.error(error);
            throw Error('Failed to create cars Table');
        }
    }

    // Sync Firestore data to SQLite
    const _syncToSQLite = (carData: Car[]) => {
        db.transaction((tx: any) => {
            carData.forEach((car: Car) => {
                if (!car.owner_uuid || !car.owner_name) {
                    console.warn(`[syncToSQLite] Skipping car with missing owner info:`, car);
                    return;
                }

                console.log(`[syncToSQLite] Inserting car ID: ${car.id}, owner_uuid: ${car.owner_uuid}`);
                tx.executeSql(
                    `INSERT OR REPLACE INTO cars (
                    id, model, price, image, 
                    category, availability, description, 
                    fuel_type, mileage, owner_name, owner_uuid) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                        car.owner_uuid,
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
            const carData: Car[] = await fetchCars(category);
            setCars(carData);
            _syncToSQLite(carData);
        } catch (error) {
            const offlineCars: Car[] = await _fetchFromSQLite();
            setCars(offlineCars);
        }
    };

    useEffect(() => {
        const init = async () => {
            await new Promise<void>((resolve, reject) => {
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
                        owner_name TEXT NOT NULL,
                        owner_uuid TEXT NOT NULL
                    )`,
                        [],
                        () => {
                            console.log('Cars table created');
                            resolve();
                        },
                        (error: any) => {
                            console.error('Error creating table:', error);
                            reject(error);
                        }
                    );
                });
            });

            _fetchCars(); // fetch after table creation
        };

        init();
    }, []);


    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu-outline" size={28} color={theme.colors.onBackground} />
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
