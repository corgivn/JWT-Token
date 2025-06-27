# JWT Token Server

A Node.js server with Express.js for generating and managing JWT tokens according to the Appotapay API specification.

## Features

- ✅ JWT token generation with custom header format
- ✅ Token verification and validation
- ✅ Token decoding for debugging
- ✅ RESTful API endpoints
- ✅ Environment-based configuration
- ✅ Error handling and validation
- ✅ CORS support

## JWT Token Format

### Header
```json
{
  "typ": "JWT",
  "alg": "HS256",
  "cty": "appotapay-api;v=1"
}
```

### Payload
```json
{
  "iss": "YOUR_PARTNER_CODE",
  "jti": "YOUR_API_KEY-{timestamp}",
  "api_key": "YOUR_API_KEY",
  "exp": 1614225624
}
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
YOUR_PARTNER_CODE=PARTNER123
YOUR_API_KEY=API_KEY_123456
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Generate JWT Token
**POST** `/api/generate-token`

Generates a new JWT token with the specified format.

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "payload": {
    "iss": "PARTNER123",
    "jti": "API_KEY_123456-1614225624",
    "api_key": "API_KEY_123456",
    "exp": 1614229224
  },
  "expires_at": "2021-02-25T10:33:44.000Z",
  "issued_at": "2021-02-25T09:33:44.000Z"
}
```

### Verify JWT Token
**POST** `/api/verify-token`

Verifies if a JWT token is valid and not expired.

**Request Body:**
```json
{
  "token": "your-jwt-token-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "decoded": {
    "iss": "PARTNER123",
    "jti": "API_KEY_123456-1614225624",
    "api_key": "API_KEY_123456",
    "exp": 1614229224
  },
  "expires_at": "2021-02-25T10:33:44.000Z"
}
```

### Decode JWT Token
**POST** `/api/decode-token`

Decodes a JWT token without verification (useful for debugging).

**Request Body:**
```json
{
  "token": "your-jwt-token-here"
}
```

### Health Check
**GET** `/api/health`

Returns server health status.

## Usage Examples

### Using cURL

Generate a token:
```bash
curl -X POST http://localhost:3000/api/generate-token
```

Verify a token:
```bash
curl -X POST http://localhost:3000/api/verify-token \
  -H "Content-Type: application/json" \
  -d '{"token":"your-jwt-token-here"}'
```

### Using JavaScript/Fetch

```javascript
// Generate token
const generateToken = async () => {
  const response = await fetch('http://localhost:3000/api/generate-token', {
    method: 'POST'
  });
  const data = await response.json();
  return data.token;
};

// Verify token
const verifyToken = async (token) => {
  const response = await fetch('http://localhost:3000/api/verify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token })
  });
  return await response.json();
};
```

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for signing JWT tokens
- `YOUR_PARTNER_CODE`: Your partner code for the `iss` claim
- `YOUR_API_KEY`: Your API key for the `api_key` and `jti` claims

### Security Notes

- Change the `JWT_SECRET` to a strong, random string in production
- Keep your `.env` file secure and never commit it to version control
- Use HTTPS in production environments
- Consider implementing rate limiting for production use

## Development

The server includes:
- Auto-reload with `nodemon` in development mode
- Comprehensive error handling
- CORS support for cross-origin requests
- Detailed logging and debugging information

## License

MIT