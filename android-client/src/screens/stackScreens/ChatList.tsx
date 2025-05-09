import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import config from '@/config.json';
import { useUser } from '@/context/UserContext';
import { ReturnButton } from '@/components/UI';
import LinearGradient from 'react-native-linear-gradient';

interface Chat {
    chatId: string;
    userId: string;
    ownerId: string;
    lastMessage: string;
    timestamp: number;
    unreadCount: number;
    displayName: string;
}

const ChatList = ({ navigation }: any) => {
    const { user } = useUser();
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const fetchChats = async () => {
            if (!user?.uuid) return;

            try {
                const res = await axios.get(`${config.WEBSOCKET_SERVER}/get_user_chats?user_id=${user.uuid}`);
                const chats = res.data;

                const userIds = new Set<string>();
                chats.forEach((chat: Chat) => {
                    userIds.add(chat.userId);
                    userIds.add(chat.ownerId);
                });

                userIds.delete(user.uuid);

                const idToName: { [uuid: string]: string } = {};
                await Promise.all(
                    Array.from(userIds).map(async (uuid) => {
                        try {
                            const resp = await axios.get(`${config.FLASK_API}/get_user_name?uuid=${uuid}`);
                            idToName[uuid] = resp.data.name;
                        } catch (err) {
                            console.warn(`[fetchChats] Failed to fetch name for ${uuid}:`, err);
                            idToName[uuid] = 'Unknown User';
                        }
                    })
                );

                const enrichedChats = chats.map((chat: Chat) => {
                    const otherUserId = chat.ownerId === user.uuid ? chat.userId : chat.ownerId;
                    return {
                        ...chat,
                        displayName: idToName[otherUserId] || 'Unknown',
                    };
                });

                setChats(enrichedChats);
            } catch (err) {
                console.log('[fetchChats] Failed to fetch chats:', (err as any)?.message || err);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchChats();

        // Set up periodic fetching
        const interval = setInterval(fetchChats, 1000);

        socketRef.current = io(`${config.WEBSOCKET_SERVER}/chat`, {
            transports: ['websocket', 'polling'],
        });


        socketRef.current.on('connect', () => {
            console.log('[ChatList] Connected to chat socket');
            socketRef.current?.emit('join_user_room', user?.uuid);
        });

        socketRef.current.on('disconnect', () => {
            console.log('[Socket] Disconnected from chat socket');
        });

        // Cleanup interval and socket connection
        return () => {
            clearInterval(interval);
            socketRef.current?.disconnect();
        };
    }, [user?.uuid]);

    if (loading) {
        return <ActivityIndicator size="large" />;
    }
    // copilot
    if (chats.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ReturnButton color='lightgrey' />
                <Text style={{ fontSize: 18, color: 'black' }}>There is no any chat yet</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            onPress={() => {
                console.log('[UI] Navigating to Chatroom with:', item);
                navigation.navigate('Chatroom', {
                    chatId: item.chatId,
                    ownerId: item.ownerId,
                    userId: user?.uuid,
                    userName: item.displayName
                });
            }}
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
                keyExtractor={(item: Chat) => item.chatId}
                renderItem={renderItem}
                style={{
                    marginTop: 50
                }}
            />
        </View>
    );
}

export default ChatList;
