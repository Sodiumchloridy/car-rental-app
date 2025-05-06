# Car Rental Authentication Service

This is a Flask-based authentication service for the Car Rental mobile application. It provides user registration, login functionality, and user profile retrieval through a RESTful API.

## Setup and Installation

### Prerequisites

- Python 3.7+
- pip package manager

### Installation

1. Clone the repository and navigate to the auth-service directory
```bash
cd auth-service
```

2. Install the poetry dependency manager
```bash
pip install poetry
```

3. Install the required dependencies:
```bash
poetry install
```

4. Run the server:
```bash
poetry run python server.py
```

The server will start on port 5000: http://localhost:5000

## API Endpoints

### Register a new user

```
POST /register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "ic_number": "123456-78-9012",
  "phone_number": "012-3456789"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### Login

```
POST /login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Get User Profile

```
GET /profile
```

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Database Schema

The authentication service uses SQLite with the following schema:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    ic_number TEXT NOT NULL,
    phone_number TEXT NOT NULL
)
```

## Integration with React Native App

To connect this authentication service with the React Native app, update the `Config.ts` file in your React Native project to point to your Flask server's address:

```typescript
export const FLASK_API = "http://10.0.2.2:5000"; // For Android emulator
// or
export const FLASK_API = "http://localhost:5000"; // For iOS simulator
// or
export const FLASK_API = "http://YOUR_IP_ADDRESS:5000"; // For physical devices
```