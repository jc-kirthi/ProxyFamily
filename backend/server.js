if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}
console.log(`🔧 Environment forced to: ${process.env.NODE_ENV}`);



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const mapRoutes = require('./routes/marketplace.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ ENSURE UPLOADS FOLDER EXISTS
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
}

// 🔧 DYNAMIC ML SERVICE URL - Works in both local and production
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
console.log(`🤖 ML Service URL: ${ML_SERVICE_URL}`);

// 🔧 COMPREHENSIVE CORS CONFIGURATION
// 🔧 COMPREHENSIVE CORS CONFIGURATION
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
        // Add localhost for testing deployed backend with local frontend
        'http://localhost:5173',
        'http://localhost:5174',
        'https://farm2-market-ashen.vercel.app',
        'https://farm2-market-git-main-pavan-hosattis-projects.vercel.app',
        'https://farm2-market-4o7xt0kgz-pavan-hosattis-projects.vercel.app',
        process.env.ML_SERVICE_URL
      ].filter(Boolean)
    : [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5001',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5001'
      ];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`⚠️  CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-auth-token'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 hours
};


app.use(cors(corsOptions));





          



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ✅ ROOT ROUTE
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'BidBuddy Platform API Running!',
        environment: process.env.NODE_ENV || 'development',
        mlServiceUrl: ML_SERVICE_URL,
        timestamp: new Date().toISOString()
    });
});

// 🔧 HEALTH CHECK ENDPOINT
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// 🔧 ML SERVICE HEALTH CHECK (Uses dynamic URL)
app.get('/api/ml-status', async (req, res) => {
    try {
        const axios = require('axios');
        const response = await axios.get(`${ML_SERVICE_URL}/`, {
            timeout: 10000 // 10 second timeout
        });
        res.json({ 
            success: true, 
            message: 'ML service is running',
            mlServiceUrl: ML_SERVICE_URL,
            mlStatus: response.data 
        });
    } catch (error) {
        console.error('❌ ML Service Error:', error.message);
        res.status(503).json({ 
            success: false, 
            message: 'ML service is not available',
            mlServiceUrl: ML_SERVICE_URL,
            error: error.message 
        });
    }
});

// ✅ IMPORT ROUTES WITH ERROR HANDLING
let authRoutes, projectListingRoutes, bidRoutes, voiceRoutes, predictRoutes, userProfileRoutes, bidbuddyRoutes;

try {
    bidbuddyRoutes = require('./routes/bidbuddy.routes');
    console.log('✅ BidBuddy routes loaded');
} catch (err) {
    console.error('❌ Error loading BidBuddy routes:', err.message);
}

try {
    authRoutes = require('./routes/authRoutes');
    console.log('✅ Auth routes loaded');
} catch (err) {
    console.error('❌ Error loading auth routes:', err.message);
}

try {
    projectListingRoutes = require('./routes/projectListingRoutes');
    console.log('✅ Project listing routes loaded');
} catch (err) {
    console.error('❌ Error loading project listing routes:', err.message);
}

try {
    bidRoutes = require('./routes/bidRoutes');
    console.log('✅ Bid routes loaded');
} catch (err) {
    console.error('❌ Error loading bid routes:', err.message);
}

try {
    voiceRoutes = require('./routes/voiceRoutes');
    console.log('✅ Voice routes loaded');
} catch (err) {
    console.error('❌ Error loading voice routes:', err.message);
}

try {
    predictRoutes = require('./routes/predictRoutes');
    console.log('✅ Predict routes loaded');
} catch (err) {
    console.error('❌ Error loading predict routes:', err.message);
}

try {
    userProfileRoutes = require('./routes/user-profile.routes');
    console.log('✅ User profile routes loaded');
} catch (err) {
    console.error('❌ Error loading user profile routes:', err.message);
}

try {
    // Legacy support for grader if needed, otherwise skip
    // aiGraderRoutes = require('./routes/aiGraderRouter');
} catch (err) {
    // console.error('❌ Error loading grader routes:', err.message);
}

// ✅ MOUNT ROUTES (ONLY IF THEY LOADED SUCCESSFULLY)
if (bidbuddyRoutes) app.use('/api/bidbuddy', bidbuddyRoutes);
if (authRoutes) app.use('/api/auth', authRoutes);
if (projectListingRoutes) app.use('/api/projects', projectListingRoutes);
if (bidRoutes) app.use('/api/bids', bidRoutes);
if (voiceRoutes) app.use('/api/voice', voiceRoutes);
if (predictRoutes) app.use('/api/predict', predictRoutes);
if (userProfileRoutes) app.use('/api/user-profile', userProfileRoutes);
app.use('/api/map', mapRoutes);


console.log('📋 Mounted routes:');
console.log('   - GET /');
console.log('   - GET /api/health');
if (bidbuddyRoutes) console.log('   - /api/bidbuddy/*');
console.log('   - GET /api/ml-status');
if (authRoutes) console.log('   - /api/auth/*');
if (projectListingRoutes) console.log('   - /api/projects/*');
if (bidRoutes) console.log('   - /api/bids/*');
if (voiceRoutes) console.log('   - /api/voice/*');
if (predictRoutes) console.log('   - /api/predict/*');
if (userProfileRoutes) console.log('   - /api/user-profile/*');

// ✅ CONNECT TO DATABASE
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        // Don't exit process - let Render restart
    });

// ✅ 404 HANDLER
app.use((req, res, next) => {
    console.log(`⚠️  404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`,
        requestedUrl: req.url,
        method: req.method,
        availableRoutes: [
            'GET /',
            'GET /api/health',
            'GET /api/ml-status',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'POST /api/bidbuddy/projects',
            'GET /api/bidbuddy/projects'
        ]
    });
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    
    // Handle CORS errors specifically
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            message: 'CORS Error: Origin not allowed',
            error: err.message
        });
    }
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
    });
});

// ✅ START SERVER
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Serving uploads from: ${uploadsDir}`);
    console.log(`🤖 ML Service URL: ${ML_SERVICE_URL}`);
    console.log(`🔗 Allowed origins:`, allowedOrigins);
});
