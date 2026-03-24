# SparkHub Setup Instructions

## 1. Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Running locally or via MongoDB Atlas URI
- **Gemini API Key**: Required for Voice AI intents and RAG operations (retrieval-augmented generation).

## 2. Backend Setup
1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Configure your `.env` file (copy from `.env.example` if available, or create a new one).
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Start the backend server: 
   ```bash
   npm run dev
   # or
   node server.js
   ```

## 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Run `npm install` to install React dependencies.
3. Configure your `.env` file in the frontend folder.
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server: 
   ```bash
   npm run dev
   ```

## 4. Running the Pitch Demo 
1. Once both servers are running smoothly, open your browser to `http://localhost:5173`.
2. On the login screen, click the **"DEMO ACCOUNT"** button to instantly authenticate as a verified user and bypass email/password entry for a seamless presentation.
