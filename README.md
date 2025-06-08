> [!NOTE]
> This project is academic coursework for UECS3253 Wireless Application Development module.

# Car Rental
![car-rental-app-banner](https://github.com/user-attachments/assets/b1b1bd8b-01d7-4cc4-9268-237aedab077a)

A comprehensive full-stack car rental management system designed to streamline the vehicle rental process for both customers and car owners. This application features a React Native mobile client for customer interactions, a Flask-based authentication backend, and a real-time chat websocket for instant customer support communication.

## Project Structure

This project consists of the following main components:

- `android-client/`: React Native mobile application
- `auth-service/`: Flask-based authentication backend
- `chat-websocket/`: WebSocket for chat fetching and storing

## Getting Started

### 1. Setting Up the React Native Client

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

### 2. Setting Up the Authentication Service

1. Navigate to the auth-service directory
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

The authentication server will start on port 5000: http://localhost:5000

### 3. Setting Up the Chat WebSocket

1. Navigate to the auth-service directory
```bash
cd chat-websocket
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
poetry run python websocket.py
```

The WebSocket server will start on port 5001: http://localhost:5001

## Integration

To connect the React Native app with the authentication service, modify the `config.json` file in your React Native project's `src` directory:

```json
{
  "FLASK_API": "http://10.0.2.2:5000",  // For Android emulator
  // Use "http://localhost:5000" for iOS simulator
  // Use "http://YOUR_IP_ADDRESS:5000" for physical devices
  "WEBSOCKET_SERVER": "http://10.0.2.2:5001" // For Android emulator
  // Use "http://localhost:5001" for iOS simulator
  // Use "http://YOUR_IP_ADDRESS:5001" for physical devices
}
```
## Development
To import the configurations in your files:

```typescript
// Direct import
import config from '../../config.json';

// Then use it like:
const apiUrl = config.FLASK_API;
```

Make sure your `tsconfig.json` has JSON module resolution enabled:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    // ... other options
  }
}
```
