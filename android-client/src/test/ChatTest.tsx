import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import io, { Socket } from 'socket.io-client';

interface ChatMessage {
    chatId: string;
    senderId: string;
    message: string;
}

const socket: Socket = io('http://192.168.0.111:5001/chat', {
    transports: ['websocket'], // Avoid long-polling
});

const userId = 'user123';
const ownerId = 'owner456';
const chatId = userId < ownerId ? `${userId}_${ownerId}` : `${ownerId}_${userId}`;

export default function ChatTest(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

    useEffect(() => {
        console.log('[ChatTest] useEffect triggered');

        socket.on('connect', () => {
            console.log('[ChatTest] Socket connected:', socket.id);
            socket.emit('join_chat', { userId, ownerId });
        });

        socket.on('receive_message', (msg: ChatMessage) => {
            console.log('[ChatTest] Received message:', msg);
            setChatLog((prev) => [...prev, msg]);
        });

        socket.on('disconnect', () => {
            console.log('[ChatTest] Socket disconnected');
        });

        socket.on('connect_error', (err: Error) => {
            console.log('[ChatTest] Connection Error:', err);
        });

        return () => {
            console.log('[ChatTest] Cleaning up socket');
            socket.off('receive_message');
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const payload: ChatMessage = {
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

    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isSender = item.senderId === userId;
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
            </View>
        );
    };

    console.log('[ChatTest] ChatLog:', chatLog); // Debugging line to check the state

    return (
        <View style={{ padding: 20, flex: 1 }}>
            <FlatList
                data={chatLog}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }} // Ensure space for the input box
            />
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                style={styles.input}
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        color: 'black',
        borderWidth: 1,
        marginBottom: 10,
        padding: 8,
        borderRadius: 4,
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
        fontSize: 16,
        padding: 5,
    },
    senderText: {
        color: 'white',
    },
    receiverText: {
        color: 'black',
    },
});
