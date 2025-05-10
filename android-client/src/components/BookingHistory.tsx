import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Booking } from '../types/Types';
import { useUser } from '@/context/UserContext';
import { fetchBookingHistory } from '@/utils/FirebaseActions';
import { styles } from '@/styles/BookingHistory.styles';

const BookingHistory = () => {
  type BookingWithId = Booking & { id: string };

  const [history, setHistory] = useState<BookingWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await fetchBookingHistory(user?.uuid || '');
        setHistory(bookings);
      } catch (error) {
        console.error('Error fetching booking history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uuid) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user?.uuid]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>
          No bookings found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {history.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.title}>
            Booking Confirmed
          </Text>
          <Text style={styles.detailText}>
            Car ID: {item.car_id}
          </Text>
          <Text style={styles.detailText}>
            Start: {item.start_date}
          </Text>
          <Text style={styles.detailText}>
            End: {item.end_date}
          </Text>
          <Text style={styles.detailText}>
            Price: RM {parseFloat(item.price).toFixed(2)}
          </Text>
          <Text style={styles.detailText}>
            Payment: {item.payment}
          </Text>
          <Text style={styles.detailText}>
            Booked by: {item.renter.name}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default BookingHistory;
