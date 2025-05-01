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
  