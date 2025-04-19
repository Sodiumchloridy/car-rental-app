import React, { useState, useEffect } from 'react'
import { Text, FlatList, View } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import firestore from '@react-native-firebase/firestore';

const db = SQLite.openDatabase({ name: 'carRental.db', location: 'default' });


const sedanList = () => {
    const [cars, setCars] = useState([]);

    // initialize the cars table
    const _createCarsTable = () => {
        try {
            db.transaction(tx => {
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
    const _fetchFromFirestore = async () => {
        try {
            const snapshot = await firestore()
                .collection('cars')
                .where('category', '==', 'Sedan')
                .get();
            // snapshot.docs will return array of DocumentSnapshot
            const carData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return carData;
        } catch (error) {
            console.error('Firestore fetch error:', error);
            throw error;
        }
    };

    // Sync Firestore data to SQLite
    const syncToSQLite = (carData: any) => {
        db.transaction(tx => {
            carData.forEach(car => {
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
                    error => console.error('Error syncing car to SQLite:', error)
                );
            });
        });
    };

    useEffect(() => {
        _createCarsTable();
    }, []);
}

export default sedanList;