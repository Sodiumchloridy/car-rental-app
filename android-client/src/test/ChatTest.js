import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://192.168.0.111:5001/chat', {
    transports: ['websocket'], // Avoid long-polling
});

const userId = 'user123';
const ownerId = 'owner456';
const chatId = userId < ownerId ? `${userId}_${ownerId}` : `${ownerId}_${userId}`;

export default function ChatTest() {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);

    useEffect(() => {
        console.log('[ChatTest] useEffect triggered');

        // Socket connection
        socket.on('connect', () => {
            console.log('[ChatTest] Socket connected:', socket.id);
            socket.emit('join_chat', { userId, ownerId });
            console.log('[ChatTest] Emitted join_chat:', { userId, ownerId });
        });

        // Message received
        socket.on('receive_message', (msg) => {
            console.log('[ChatTest] Received message:', msg);
            setChatLog((prev) => [...prev, msg]);
        });

        socket.on('disconnect', () => {
            console.log('[ChatTest] Socket disconnected');
        });

        // Error handling
        socket.on('connect_error', (err) => {
            console.log('[ChatTest] Connection Error:', err);
        });

        // Cleanup
        return () => {
            console.log('[ChatTest] Cleaning up socket');
            socket.off('receive_message');
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const payload = {
                chatId,
                senderId: userId,
                message,
            };
            console.log('[ChatTest] Sending message:', payload);
            socket.emit('send_message', payload);
            setMessage('');
        } else {
            console.log('[ChatTest] Empty message not sent');
        }
    };

    return (
        <View style={{ padding: 20, flex: 1 }}>
            <FlatList
                data={chatLog}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={{ marginVertical: 4, color: 'black' }}>
                        {`${item.senderId}: ${item.message}`}
                    </Text>
                )}
            />
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                style={{ color: 'black', borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
}
