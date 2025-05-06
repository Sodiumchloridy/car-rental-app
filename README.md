# Car Rental System

A full-stack car rental management application with a React Native mobile client and authentication backend.

## Project Structure

This project consists of the following main components:

- `android-client/`: React Native mobile application
- `auth-service/`: Flask-based authentication backend

## Features

### Mobile Application
- User authentication (login/registration)
- Browse cars by category (SUV, Sedan, Luxury)
- Car details view with specifications
- Booking system with date selection
- Online payment processing
- Booking confirmation and history
- Offline functionality with SQLite data storage
- Firebase integration for data management

### Authentication Service
- User registration with email, password, name, IC number, and phone number
- Secure login with JWT authentication
- User profile management
- SQLite database for user storage

## Technical Stack

### Mobile Client
- React Native
- Firebase Firestore
- SQLite (local storage)
- React Navigation
- Linear Gradient
- Vector Icons

### Authentication Service
- Flask
- SQLite
- JWT Authentication

## Getting Started

### Setting Up the React Native Client

1. Navigate to the Android client directory:
```bash
cd android-client
```

2. Install dependencies:
```bash
npm install
```

3. Add Firebase configuration:
   - Download your `google-services.json` file from Firebase Console
   - Place it in the `android/app/` directory

4. Clean previous builds:
```bash
cd android
./gradlew clean
cd ..
```

5. Start the app:
```bash
npm start
```

### Setting Up the Authentication Service

1. Navigate to the authentication service directory:
```bash
cd auth-service
```

2. Install dependencies:
```bash
poetry install
```

3. Run the server:
```bash
poetry run python server.py
```

The authentication server will start on port 5000: http://localhost:5000

## Integration

To connect the React Native app with the authentication service, update the `Config.ts` file in your React Native project:

```typescript
export const FLASK_API = "http://10.0.2.2:5000"; // For Android emulator
// or
export const FLASK_API = "http://localhost:5000"; // For iOS simulator
// or
export const FLASK_API = "http://YOUR_IP_ADDRESS:5000"; // For physical devices
```

## License

This project is licensed under the MIT License.