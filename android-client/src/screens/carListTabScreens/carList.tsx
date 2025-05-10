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
import { fetchCars, resetCarAvailability } from '@/utils/FirebaseActions';
import { parseDateTime } from '@/utils/TimeFormating';

const db = SQLite.openDatabase({ name: 'carRental.db', location: 'default' });

type Props = {
    category: 'SUV' | 'Sedan' | 'Luxury';
}


const carList = ({ category }: Props) => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
    const [cars, setCars] = useState<Car[]>([]);
    const theme = useTheme();

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
                    fuel_type, mileage, owner_name, owner_uuid,
                    unavailable_from, unavailable_until) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        car.id,
                        car.model,
                        car.price,
                        car.image,
                        car.category,
                        car.availability,  // Now passing 'yes' or 'booked' directly
                        car.description,
                        car.fuel_type,
                        car.mileage,
                        car.owner_name,
                        car.owner_uuid,
                        car.unavailable_from || null,
                        car.unavailable_until || null,
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
                    `SELECT * FROM cars 
                     WHERE category = ? 
                     AND availability = 'yes'
                     AND (
                         (unavailable_from IS NULL AND unavailable_until IS NULL)
                         OR 
                         (
                             datetime('now') NOT BETWEEN 
                             datetime(substr(unavailable_from,7,4) || '-' || 
                                    substr(unavailable_from,4,2) || '-' || 
                                    substr(unavailable_from,1,2) || ' ' || 
                                    substr(unavailable_from,12))
                             AND
                             datetime(substr(unavailable_until,7,4) || '-' || 
                                    substr(unavailable_until,4,2) || '-' || 
                                    substr(unavailable_until,1,2) || ' ' || 
                                    substr(unavailable_until,12))
                         )
                     )`,
                    [category],
                    (tx: any, results: any) => {
                        const rows = results.rows;
                        let offlineCars: Car[] = [];
                        for (let i = 0; i < rows.length; i++) {
                            offlineCars.push(rows.item(i));
                        }
                        resolve(offlineCars);
                    },
                    (error: any) => reject(error)
                );
            });
        });
    };

    // Main fetch logic
    const _fetchCars = async () => {
        try {
            const carData: Car[] = await fetchCars(category);
            const now = new Date();
            
            // Check and reset availability for cars with expired booking periods
            for (const car of carData) {
                if (car.unavailable_from && car.unavailable_until) {
                    const endDate = parseDateTime(car.unavailable_until);
                    
                    if (endDate && now.getTime() > endDate.getTime()) {
                        console.log(`Resetting availability for car ${car.id} - booking period ended`);
                        await resetCarAvailability(car.id);
                    }
                }
            }

            const availableCars = carData.filter(car => {
                console.log('\nChecking car:', car.id);
                console.log('Availability:', car.availability);
                console.log('Booking dates:', {
                    from: car.unavailable_from,
                    until: car.unavailable_until
                });

                // Only proceed if availability is 'yes'
                if (car.availability !== 'yes') {
                    console.log('Car filtered out - not available');
                    return false;
                }

                // If booking dates exist, check if we're within booking period
                if (car.unavailable_from && car.unavailable_until) {
                    const startDate = parseDateTime(car.unavailable_from);
                    const endDate = parseDateTime(car.unavailable_until);
                    
                    if (!startDate || !endDate) {
                        console.log('Car filtered out - invalid dates');
                        return false;
                    }

                    // Compare using local time
                    const isWithinBooking = 
                        now.getTime() >= startDate.getTime() && 
                        now.getTime() <= endDate.getTime();
                    
                    console.log('Date comparison:', {
                        nowLocal: now.toLocaleString(),
                        startLocal: startDate.toLocaleString(),
                        endLocal: endDate.toLocaleString(),
                        isWithinBooking
                    });

                    return !isWithinBooking;
                }

                console.log('Car included - no booking dates');
                return true;
            });
            
            console.log(`Filtered ${carData.length} cars down to ${availableCars.length} available cars`);
            setCars(availableCars);
            _syncToSQLite(carData);
        } catch (error) {
            console.error('Error fetching cars:', error);
            const offlineCars: Car[] = await _fetchFromSQLite();
            setCars(offlineCars);
        }
    };

    const checkCarAvailability = async () => {
        try {
            const carData: Car[] = await fetchCars(category);
            const now = new Date();

            for (const car of carData) {
                if (car.unavailable_from && car.unavailable_until) {
                    const endDate = parseDateTime(car.unavailable_until);
                    
                    if (endDate && now.getTime() > endDate.getTime()) {
                        await resetCarAvailability(car.id);
                    }
                }
            }
            
            _fetchCars();
        } catch (error) {
            console.error('Error checking car availability:', error);
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
                        availability TEXT DEFAULT 'yes',
                        description TEXT,
                        fuel_type TEXT,
                        mileage REAL,
                        owner_name TEXT NOT NULL,
                        owner_uuid TEXT NOT NULL,
                        unavailable_from TEXT,
                        unavailable_until TEXT
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

            _fetchCars(); 
        };

        init();
    }, []);

    useEffect(() => {
        // Check availability every minute
        const availabilityInterval = setInterval(checkCarAvailability, 60000);
        
        // Initial check
        checkCarAvailability();

        return () => clearInterval(availabilityInterval);
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            _fetchCars();
        });

        return unsubscribe;
    }, [navigation]);

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
