import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Booking } from '../../types/Types';
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import { DrawerParamList } from '../../types/Types';
import Ionicons from "react-native-vector-icons/Ionicons";


const BookingHistroyScreen = () => {
  type BookingWithId = Booking & { id: string };
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [history, setHistory] = useState<BookingWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('bookings')
      .orderBy('booking_date', 'desc')
      .onSnapshot(snapshot => {
        const bookingData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BookingWithId[];

        setHistory(bookingData);
        setLoading(false);
      }, error => {
        console.error("Error fetching history:", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00b14f" />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No bookings found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Booking Confirmed</Text>
            <Text style={styles.detailText}>Car ID: {item.car_id}</Text>
            <Text style={styles.detailText}>Start: {item.start_date}</Text>
            <Text style={styles.detailText}>End: {item.end_date}</Text>
            <Text style={styles.detailText}>Price: RM {parseFloat(item.price).toFixed(2)}</Text>
            <Text style={styles.detailText}>Payment: {item.payment}</Text>
            <Text style={styles.detailText}>Booked by: {item.renter.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b14f',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  }
});

export default BookingHistroyScreen;