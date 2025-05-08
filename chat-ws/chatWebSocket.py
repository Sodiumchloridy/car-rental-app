import sqlite3
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, join_room
from datetime import datetime
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app, cors_allowed_origins="*")

DATABASE = 'car_rental.db'

def init_db():
    conn = sqlite3.connect('car_rental.db')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS user_chats (
            userId TEXT,
            chatId TEXT,
            PRIMARY KEY (userId, chatId)
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            chatId TEXT PRIMARY KEY,
            userId TEXT,
            ownerId TEXT,
            lastMessage TEXT,
            timestamp TEXT,
            unreadCount INTEGER
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            chatId TEXT,
            senderId TEXT,
            message TEXT,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@socketio.on('join_chat', namespace='/chat')
def join_chat(data):
    user_id = data['userId']
    owner_id = data['ownerId']

    #create chat id
    chat_id = f"{user_id}_{owner_id}" if user_id < owner_id else f"{owner_id}_{user_id}"

    conn = get_db()
    conn.execute('INSERT OR IGNORE INTO user_chats (userId, chatId) VALUES (?, ?)', (user_id, chat_id))
    conn.execute('INSERT OR IGNORE INTO user_chats (userId, chatId) VALUES (?, ?)', (owner_id, chat_id))
    conn.commit()

    join_room(chat_id)
    print(f"User {user_id} joined chat {chat_id}")
    emit('joined_chat', {'chatId': chat_id}, room=chat_id)

# handle incoming message
@socketio.on('send_message', namespace='/chat')
def send_message(data):
    chat_id = data['chatId']
    sender_id = data['senderId']
    message = data['message']
    timestamp = datetime.now()

    #store message to database
    conn = get_db()
    conn.execute('INSERT INTO messages (chatId, senderId, message, timestamp) VALUES (?, ?, ?, ?)',
                 (chat_id, sender_id, message, datetime.now()))
    
    user_id, owner_id = chat_id.split('_') if sender_id == chat_id.split('_')[0] else chat_id.split('_')[::-1]

    conn.execute('''
        INSERT INTO chats (chatId, userId, ownerId, lastMessage, timestamp, unreadCount)
        VALUES (?, ?, ?, ?, ?, 1)
        ON CONFLICT(chatId) DO UPDATE SET
            lastMessage=excluded.lastMessage,
            timestamp=excluded.timestamp,
            unreadCount=chats.unreadCount + 1
    ''', (chat_id, user_id, owner_id, message, timestamp))

    conn.commit()
    conn.close()

    #Broadcast message to both user and owner in the chat room
    message_data = {
        'senderId': sender_id, 
        'message': message, 
        'timestamp': str(timestamp)
    }
    emit('receive_message', message_data, room=chat_id)

# fetch chat history
@app.route('/get_chat_history', methods=['GET'])
def get_chat_history():
    chat_id = request.args.get('chatId')
    conn = get_db()
    messages = conn.execute('SELECT senderId, message, timestamp FROM messages WHERE chatId = ? ORDER BY timestamp',
                            (chat_id,)).fetchall()
    chat_history = [{'senderId': msg['senderId'], 'message': msg['message'], 'timestamp': msg['timestamp']} for msg in messages]
    return jsonify(chat_history)

@app.route('/api/messages')
def api_messages():
    chat_id = request.args.get('chatId')
    conn = get_db()
    messages = conn.execute('SELECT * FROM messages WHERE chatId = ?', (chat_id,)).fetchall()
    return jsonify([dict(row) for row in messages])


if __name__ == '__main__':
    init_db()
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)