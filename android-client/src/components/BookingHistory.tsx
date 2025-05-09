import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Booking } from '../types/Types';
import { useUser } from '@/context/UserContext';
import { fetchBookingHistory } from '@/utils/FirebaseActions';

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

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    color: '#1A1A1A',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#CCCCCC',
  }
});

export default BookingHistory;
