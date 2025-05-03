export interface Car {
    id: string;
    model: string;
    price: number;
    image?: string;
    category: string;
    availability: number;
    description?: string;
    fuel_type?: string;
    mileage?: number;
}

export type Renter = {
    name: string;
    email: string;
    ic: string;
    phone_no: string;
}

export type Booking = {
    car_id: string;
    user_id: string;
    start_date: Date;
    end_date: Date;
    booking_date: Date;
    price: string;
    payment: string;
    renter: Renter;
}

export type RootStackParamList = {
    Home: undefined;
    CarTabs: undefined;
    CarDetail: { car: Car };
    Booking: {car: Car}; 
    DrawerMenu: undefined;
};

export type DrawerParamList = {
    Profile: undefined;
    Notification: undefined;
    MainApp: undefined;
  };
  