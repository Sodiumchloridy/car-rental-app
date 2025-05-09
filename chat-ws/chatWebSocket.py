import sqlite3
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, join_room
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app, cors_allowed_origins="*")

DATABASE = 'car_rental.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
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
    print("✅ Database initialized")

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@socketio.on('join_room', namespace='/chat')
def join_personal_room(data):
    user_id = data['userId']
    join_room(user_id)
    print(f"👤 User {user_id} joined personal room for chat updates")


@socketio.on('join_chat', namespace='/chat')
def join_chat(data):
    chat_id = data['chatId']
    user_id = data['userId']
    owner_id = data['ownerId']
    print(f"🟢 join_chat triggered — chatId: {chat_id}, userId: {user_id}, ownerId: {owner_id}")

    conn = get_db()
    conn.execute('INSERT OR IGNORE INTO user_chats (userId, chatId) VALUES (?, ?)', (user_id, chat_id))
    conn.execute('INSERT OR IGNORE INTO user_chats (userId, chatId) VALUES (?, ?)', (owner_id, chat_id))
    conn.commit()

    join_room(chat_id)
    print(f"✅ User {user_id} joined room {chat_id}")

    emit('joined_chat', {'chatId': chat_id}, room=chat_id)

@socketio.on('send_message', namespace='/chat')
def send_message(data):
    chat_id = data['chatId']
    sender_id = data['senderId']
    message = data['message']
    timestamp = datetime.now()

    print(f"✉️ send_message received — chatId: {chat_id}, senderId: {sender_id}, message: {message}, timestamp: {timestamp}")

    conn = get_db()
    conn.execute('INSERT INTO messages (chatId, senderId, message, timestamp) VALUES (?, ?, ?, ?)',
                 (chat_id, sender_id, message, timestamp))

    user_id, owner_id = chat_id.split('_') if sender_id == chat_id.split('_')[0] else chat_id.split('_')[::-1]
    print(f"🔁 Updating chats table — userId: {user_id}, ownerId: {owner_id}")

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

    print(f"📤 Emitting receive_message to room {chat_id}")
    emit('receive_message', {
        'senderId': sender_id,
        'message': message,
        'timestamp': str(timestamp)
    }, room=chat_id)

    print(f"🔔 Emitting chat_updated to users: {user_id}, {owner_id}")
    chat_update_payload = {
        'chatId': chat_id,
        'lastMessage': message,
        'timestamp': str(timestamp),
        'from': sender_id,
        'to': owner_id if sender_id == user_id else user_id
    }

    emit('chat_updated', chat_update_payload, room=user_id)
    emit('chat_updated', chat_update_payload, room=owner_id)


@app.route('/get_chat_history', methods=['GET'])
def get_chat_history():
    chat_id = request.args.get('chatId')
    print(f"📚 get_chat_history for chatId: {chat_id}")
    conn = get_db()
    messages = conn.execute('SELECT senderId, message, timestamp FROM messages WHERE chatId = ? ORDER BY timestamp',
                            (chat_id,)).fetchall()
    chat_history = [{'senderId': msg['senderId'], 'message': msg['message'], 'timestamp': msg['timestamp']} for msg in messages]
    return jsonify(chat_history)

@app.route('/get_user_chats', methods=['GET'])
def get_user_chats():
    user_id = request.args.get('user_id')
    print(f"📋 get_user_chats for user_id: {user_id}")
    conn = get_db()
    cursor = conn.execute('''
        SELECT c.chatId, c.userId, c.ownerId, c.lastMessage, c.timestamp, c.unreadCount
        FROM user_chats uc
        JOIN chats c ON uc.chatId = c.chatId
        WHERE uc.userId = ?
        ORDER BY c.timestamp DESC
    ''', (user_id,))
    chats = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(chats)

if __name__ == '__main__':
    init_db()
    print("🚀 Server starting on port 5001")
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)
