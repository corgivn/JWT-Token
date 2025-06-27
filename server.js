const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
// Helper function to generate current timestamp
const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

// Route to generate JWT token
app.post('/api/generate-token', (req, res) => {
    try {
        // Get JWT header from custom HTTP header (x-jwt-header)
        const headerRaw = req.headers['x-jwt-header'];
        let header;
        try {
            header = JSON.parse(headerRaw);
        } catch (e) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or missing x-jwt-header. It must be a valid JSON string.'
            });
        }

        const { payload } = req.body;
        if (!header || !payload) {
            return res.status(400).json({
                success: false,
                error: 'Both x-jwt-header and payload are required.'
            });
        }

        // Generate the token with custom header and payload
        const token = jwt.sign(payload, JWT_SECRET, {
            algorithm: header.alg || 'HS256',
            header: header
        });

        res.json({
            success: true,
            token: token
        });

    } catch (error) {
        console.error('Error generating JWT:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate JWT token',
            message: error.message
        });
    }
});

// Route to verify JWT token
app.post('/api/verify-token', (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token is required'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        res.json({
            success: true,
            message: 'Token is valid',
            decoded: decoded,
            expires_at: new Date(decoded.exp * 1000).toISOString()
        });

    } catch (error) {
        console.error('Error verifying JWT:', error);

        let errorMessage = 'Invalid token';
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token has expired';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token format';
        }

        res.status(401).json({
            success: false,
            error: errorMessage,
            message: error.message
        });
    }
});

// Route to decode JWT token without verification (for debugging)
app.post('/api/decode-token', (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token is required'
            });
        }

        // Decode without verification
        const decoded = jwt.decode(token, { complete: true });

        if (!decoded) {
            return res.status(400).json({
                success: false,
                error: 'Invalid token format'
            });
        }

        res.json({
            success: true,
            header: decoded.header,
            payload: decoded.payload,
            expires_at: decoded.payload.exp ? new Date(decoded.payload.exp * 1000).toISOString() : null
        });

    } catch (error) {
        console.error('Error decoding JWT:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to decode token',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'JWT Token Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'JWT Token Server API',
        version: '1.0.0',
        endpoints: {
            'POST /api/generate-token': 'Generate a new JWT token',
            'POST /api/verify-token': 'Verify an existing JWT token',
            'POST /api/decode-token': 'Decode a JWT token without verification',
            'GET /api/health': 'Health check endpoint'
        },
        example_usage: {
            generate_token: {
                method: 'POST',
                url: '/api/generate-token',
                description: 'Generates a JWT token with the specified format'
            },
            verify_token: {
                method: 'POST',
                url: '/api/verify-token',
                body: { token: 'your-jwt-token-here' },
                description: 'Verifies if a JWT token is valid'
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `${req.method} ${req.originalUrl} is not a valid endpoint`
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 JWT Token Server is running on port ${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
