import { User } from '@/types/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import RNFS from 'react-native-fs';

const userFilePath = RNFS.DocumentDirectoryPath + '/user.json';

const UserContext = createContext<{
    user: User | null;
    setUser: (user: User | null) => Promise<void>;
    logout: () => Promise<void>;
}>({
    user: null,
    setUser: async () => { },
    logout: async () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, _setUserState] = useState<User | null>(null);

    // Load user from file on component mount
    useEffect(() => {
        const loadUserFromFile = async () => {
            try {
                const fileExists = await RNFS.exists(userFilePath);
                if (fileExists) {
                    const content = await RNFS.readFile(userFilePath, 'utf8');
                    if (content) {
                        const userData = JSON.parse(content);
                        _setUserState(userData);
                    }
                }
            } catch (error) {
                console.error('Failed to load user from file:', error);
            }
        };
        loadUserFromFile();
    }, []);

    const setUser = async (newUser: User | null) => {
        _setUserState(newUser);
        try {
            if (newUser) {
                await RNFS.writeFile(userFilePath, JSON.stringify(newUser), 'utf8');
            } else {
                // If user is null, delete the file or write null/empty object
                const fileExists = await RNFS.exists(userFilePath);
                if (fileExists) {
                    await RNFS.unlink(userFilePath);
                }
            }
        } catch (error) {
            console.error('Failed to save user to file:', error);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        _setUserState(null); // Update React state
        try {
            const fileExists = await RNFS.exists(userFilePath);
            if (fileExists) {
                await RNFS.unlink(userFilePath); // Delete user.json on logout
            }
        } catch (error) {
            console.error('Failed to delete user file on logout:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
