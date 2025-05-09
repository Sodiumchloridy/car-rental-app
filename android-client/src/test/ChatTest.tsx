import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import io, { Socket } from 'socket.io-client';
import config from "@/config.json";

interface ChatMessage {
    chatId: string;
    senderId: string;
    message: string;
    timestamp: string;
}

export default function ChatTest(): JSX.Element {
    const [isOwner, setIsOwner] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);


    const generateChatId = (a: string, b: string): string => {
        return a < b ? `${a}_${b}` : `${b}_${a}`;
    };

    const userId = isOwner ? '8e6ec9b5-bf51-4656-a898-3054c5976c93' : '58107c8a-e695-417e-9934-627d4b836263';
    const otherId = isOwner ? '58107c8a-e695-417e-9934-627d4b836263' : '8e6ec9b5-bf51-4656-a898-3054c5976c93';
    const chatId = generateChatId(userId, otherId);

    // Fetch previous messages from the server when the component is mounted
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`${config.WEBSOCKET_SERVER}/get_chat_history?chatId=${chatId}`);
                const data = await response.json();
                setChatLog(data); // Update the chatLog with previous messages
            } catch (error) {
                console.log('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();

        const newSocket = io(`${config.WEBSOCKET_SERVER}/chat`, {
            transports: ['websocket'],
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('[ChatTest] Socket connected:', newSocket.id);
            newSocket.emit('join_chat', { userId, ownerId: otherId });
        });

        newSocket.on('receive_message', (msg: ChatMessage) => {
            console.log('[ChatTest] Received message:', msg);
            setChatLog((prev) => [...prev, msg]); // Append new messages to the chat log
        });

        newSocket.on('disconnect', () => {
            console.log('[ChatTest] Socket disconnected');
        });

        newSocket.on('connect_error', (err: Error) => {
            console.log('[ChatTest] Connection Error:', err);
        });

        return () => {
            console.log('[ChatTest] Cleaning up socket');
            newSocket.disconnect();
        };
    }, [isOwner]);

    const sendMessage = () => {
        if (message.trim() && socket) {
            const payload: ChatMessage = {
                chatId,
                senderId: userId,
                message,
                timestamp: new Date().toISOString(),
            };
            console.log('[ChatTest] Sending message:', payload);
            socket.emit('send_message', payload);
            setMessage(''); // Clear the input after sending
        }
    };

    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isSender = item.senderId === userId;
        const formattedTime = item.timestamp
            ? new Date(item.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            })
            : '';
        return (
            <View
                style={[
                    styles.messageContainer,
                    isSender ? styles.senderContainer : styles.receiverContainer,
                ]}
            >
                <Text
                    style={[styles.messageText, isSender ? styles.senderText : styles.receiverText]}
                >
                    {item.message}
                </Text>
                {item.timestamp && (
                    <Text style={styles.timestampText}>{formattedTime}</Text>
                )}
            </View>
        );
    };

    return (
        <View style={{ padding: 20, flex: 1 }}>
            <Text style={{ marginBottom: 10, fontWeight: 'bold', color: 'black' }}>
                Current Role: {isOwner ? 'Owner' : 'User'} ({userId})
            </Text>
            <Button
                title={`Switch to ${isOwner ? 'User' : 'Owner'} Mode`}
                onPress={() => {
                    setChatLog([]); // Clear chat log when switching
                    setIsOwner(!isOwner);
                }}
            />

            <FlatList
                data={chatLog}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                style={{ flex: 1, marginTop: 20 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <View style={styles.inputRow}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                    placeholderTextColor="gray"
                    style={styles.input}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Ionicons name="paper-plane" size={28} color={'#00b14f'} />
                </TouchableOpacity>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        color: 'black',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 8,
        borderRadius: 4,
    },
    sendButton: {
        marginLeft: 10,
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    senderContainer: {
        backgroundColor: 'black',
        alignSelf: 'flex-end',
    },
    receiverContainer: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'gray',
    },
    messageText: {
        fontSize: 15,
    },
    senderText: {
        color: 'white',
    },
    receiverText: {
        color: 'black',
    },
    timestampText: {
        fontSize: 10,
        color: 'gray',
        marginTop: 4,
        textAlign: 'right',
    },
});
