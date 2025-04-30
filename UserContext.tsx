import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
    id: string;
    name: string;
    email: string;
    ic: string;
    phone_no: string;
} | null;

const UserContext = createContext<{
    user: User;
    setUser: (user: User) => void;
}>({
    user: null,
    setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
