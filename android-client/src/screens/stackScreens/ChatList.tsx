import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import io, { Socket } from 'socket.io-client';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import config from '@/config.json';
import { ReturnButton } from '@/components/UI';
import LinearGradient from 'react-native-linear-gradient';

interface ChatMessage {
    chatId: string;
    senderId: string;
    message: string;
    timestamp: string;
}

const ChatList = ({ navigation }: any) => {
    const { user } = useUser();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            axios
                .get(`${config.Websocker_Server}/get_user_chats?user_id=${user.id}`)
                .then(async (res) => {
                    const chats = res.data;

                    // Extract unique user UUIDs to fetch names
                    const userIds = new Set<string>();
                    chats.forEach(chat => {
                        userIds.add(chat.userId);
                        userIds.add(chat.ownerId);
                    });

                    // Remove current user ID — no need to fetch our own name
                    userIds.delete(user.id);

                    // Fetch all names in parallel
                    const idToName: { [uuid: string]: string } = {};
                    await Promise.all(
                        Array.from(userIds).map(async (uuid) => {
                            try {
                                const resp = await axios.get(`${config.FLASK_API}/get_user_name?uuid=${uuid}`);
                                idToName[uuid] = resp.data.name;
                            } catch (e) {
                                console.warn(`Failed to get name for ${uuid}`);
                                idToName[uuid] = 'Unknown User';
                            }
                        })
                    );

                    // Attach displayName to each chat
                    const enrichedChats = chats.map(chat => {
                        const otherUserId = chat.ownerId === user.id ? chat.userId : chat.ownerId;
                        return {
                            ...chat,
                            displayName: idToName[otherUserId] || 'Unknown',
                        };
                    });

                    setChats(enrichedChats);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user?.id]);
    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Chatroom', { chatId: item.chatId, ownerId: item.ownerId, userId: user?.id, userName: item.displayName })}
            style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ddd' }}
        >
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 18 }}>
                Chat with: {item.displayName}
            </Text>
            <Text numberOfLines={1} style={{ color: 'black', alignSelf: 'flex-end', right: 10 }}>{item.lastMessage}</Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>{new Date(item.timestamp).toLocaleString()}</Text>
        </TouchableOpacity>
    );
    return (
        <View>
            <ReturnButton color='lightgrey' />
            <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 100,
                }}
                locations={[0, 0.8]}
            />
            <FlatList
                data={chats}
                keyExtractor={(item) => item.chatId}
                renderItem={renderItem}
                style={{
                    marginTop: 50
                }}
            />
        </View>
    );
}

export default ChatList;
