import { ReturnButton } from '@/components/UI';
import config from '@/config.json';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import io, { Socket } from 'socket.io-client';

interface ChatMessage {
    chatId: string;
    senderId: string;
    message: string;
    timestamp: string;
}

const Chatroom = ({ route, navigation }: any) => {
    const { chatId, userName, userId, ownerId } = route.params;

    const [isOwner, setIsOwner] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const flatListRef = useRef<FlatList>(null);

    const onPressFunc = () => {
        navigation.navigate('ChatList')
    }

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`${config.WEBSOCKET_SERVER}/get_chat_history?chatId=${chatId}`);
                const data = await response.json();
                setChatLog(data);
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
            console.log('[Chatroom] Socket connected:', newSocket.id);
            newSocket.emit('join_chat', { chatId, userId, ownerId });
        });

        newSocket.on('receive_message', (msg: ChatMessage) => {
            setChatLog((prev) => [...prev, msg]);
        });

        newSocket.on('disconnect', () => {
            console.log('[Chatroom] Socket disconnected');
        });

        newSocket.on('connect_error', (err: Error) => {
            console.log('[Chatroom] Connection Error:', err);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [chatId, userId, ownerId]); // more accurate dependency list

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
        <View style={{ flex: 1 }}>
            <ReturnButton />
            <View style={{
                alignContent: 'center',
                alignItems: 'center',
                borderBottomColor: 'grey',
                paddingVertical: 10,
                borderWidth: 0.5,
                backgroundColor: 'rgba(0,0,0,0.8)'
            }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>{userName}</Text>
            </View>
            <View style={{ padding: 20, flex: 1, paddingVertical: 5 }}>
                <FlatList
                    ref={flatListRef}
                    data={chatLog}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                    style={{ flex: 1, marginTop: 0 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    onContentSizeChange={() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }}
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

        </View>
    );

}

export default Chatroom;

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5
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
