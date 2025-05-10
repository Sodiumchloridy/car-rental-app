export interface Car {
    id: string;
    model: string;
    price: number;
    image?: string;
    category: string;
    availability: string;
    description?: string;
    fuel_type?: string;
    mileage?: number;
    owner_name: string;
    owner_uuid: string;
    unavailable_from?: string;
    unavailable_until?: string;
}

export interface User {
    uuid: string;
    name: string;
    email: string;
    ic_number: string;
    phone_number: string;
};

export type Renter = {
    name: string;
    email: string;
    ic: string;
    phone_no: string;
}

export type Booking = {
    car_id: string;
    user_id: string;
    start_date: string;
    end_date: string;
    booking_date: string;
    price: string;
    payment: string;
    renter: Renter;
}

export type RootStackParamList = {    
    Home: undefined;
    Login: undefined;
    ChatList: undefined;
    Chatroom: undefined;
    Register: undefined;
    CarTabs: undefined;
    CarDetail: { car: Car };
    Booking: { car: Car };
    DrawerMenu: undefined;
    BookingConfirm: { bookingID: string, bookingData: Booking };
    ListCarScreen: undefined;
    UpdateCar: { car: Car };
};

export type DrawerParamList = {
    Profile: undefined;
    Notification: undefined;
    MainApp: undefined;
    EditProfile: undefined;
};
