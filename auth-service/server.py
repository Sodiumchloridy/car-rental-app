from flask import Flask, request, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os
import jwt
import datetime
import uuid
from functools import wraps

app = Flask(__name__)
DATABASE = 'auth.db'
SECRET_KEY = 'carRentalApp'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DATABASE):
        conn = get_db()
        conn.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT NOT NULL UNIQUE,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                ic_number TEXT NOT NULL,
                phone_number TEXT NOT NULL
            )
        ''')
        conn.commit()
        seed_db()
        conn.close()

def seed_db():
    """Seed the database with mock data for testing and development purposes."""
    conn = get_db()
    
    # Check if there are already users in the database
    user_count = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    
    if user_count == 0:
        # Sample users data
        mock_users = [
            {
                'uuid': 'c35cddf9-0c8e-4d67-8d1a-20cee277eaf4',
                'email': 'hussain@example.com',
                'password': generate_password_hash('password123'),
                'name': 'Sedan Hussain',
                'ic_number': '901234-56-7890',
                'phone_number': '012-3456789'
            },
            {
                'uuid': 'b3c3f337-9c77-4506-aaa6-23a7a412c25a',
                'email': 'jane@example.com',
                'password': generate_password_hash('password123'),
                'name': 'Jane Smith',
                'ic_number': '890123-45-6789',
                'phone_number': '019-8765432'
            },
            {
                'uuid': '1cacad86-b5bf-40b2-8050-0a1a062c18d1',
                'email': 'admin@carental.com',
                'password': generate_password_hash('admin123'),
                'name': 'Car Rental',
                'ic_number': '780912-34-5678',
                'phone_number': '011-2345678'
            }
        ]
        
        for user in mock_users:
            try:
                conn.execute(
                    'INSERT INTO users (uuid, email, password, name, ic_number, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
                    (user['uuid'], user['email'], user['password'], user['name'], user['ic_number'], user['phone_number'])
                )
            except sqlite3.IntegrityError:
                # Skip if user already exists (unlikely but possible with fixed emails)
                pass
                
        conn.commit()
        print("Database seeded with mock users.")
    else:
        print("Database already contains users, skipping seeding.")
    
    conn.close()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = {
                'uuid': data['uuid'],
                'email': data['email'],
                'name': data['name'],
                'ic_number': data['ic_number'],
                'phone_number': data['phone_number']
            }
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the Auth Service'}), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    ic_number = data.get('ic_number')
    phone_number = data.get('phone_number')

    if not email or not password or not name or not ic_number or not phone_number:
        return jsonify({'error': 'All fields are required'}), 400

    hashed_password = generate_password_hash(password)
    user_uuid = str(uuid.uuid4())
    try:
        conn = get_db()
        conn.execute('INSERT INTO users (uuid, email, password, name, ic_number, phone_number) VALUES (?, ?, ?, ?, ?, ?)', (user_uuid, email, hashed_password, name, ic_number, phone_number))
        conn.commit()
        conn.close()
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    if user and check_password_hash(user['password'], password):
        payload = {
            'uuid': user['uuid'],
            'email': user['email'],
            'name': user['name'],
            'ic_number': user['ic_number'],
            'phone_number': user['phone_number'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'uuid': user['uuid'],
                'email': user['email'],
                'name': user['name'],
            }
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    return jsonify({'user': current_user}), 200

@app.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    return jsonify({'message': 'Logged out successfully'}), 200

if __name__ == '__main__':
    init_db()
    seed_db()
    app.run(debug=True, host='0.0.0.0')
