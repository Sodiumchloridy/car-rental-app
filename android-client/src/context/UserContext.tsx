import { User } from '@/types/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useState } from 'react';

const UserContext = createContext<{
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}>({
    user: null,
    setUser: () => { },
    logout: () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const logout = () => {
        AsyncStorage.removeItem('userToken');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
