import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types/Types';

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
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
