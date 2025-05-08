import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Booking } from '../../types/Types';
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import { DrawerParamList } from '../../types/Types';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from 'react-native-paper';


const BookingHistroyScreen = () => {
  type BookingWithId = Booking & { id: string };
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [history, setHistory] = useState<BookingWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  //Retrieve the booking records from firebase and sort the records in descending order by date
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
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.noDataText, { color: theme.colors.text }]}>
          No bookings found.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.background  }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }]}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              Booking Confirmed
            </Text>
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              Car ID: {item.car_id}
            </Text>
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              Start: {item.start_date}
            </Text>
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              End: {item.end_date}
            </Text>
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              Price: RM {parseFloat(item.price).toFixed(2)}
            </Text>
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              Payment: {item.payment}
            </Text>
            <Text style={[styles.detailText, { color: theme.colors.text }]}>
              Booked by: {item.renter.name}
            </Text>
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
  },
  listContainer: {
    padding: 16,
  },
  card: {
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
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
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
