# 🤖 Bybit P2P Multi-User Telegram Bot + Miniapp

A production-ready Telegram bot and web miniapp for Bybit P2P trading, featuring multi-user support, real-time order management, and integrated payments.

## Features

✅ **Telegram Bot**
- Multi-user support with session management
- Create, edit, delete, and manage P2P advertisements
- View pending orders and mark as paid
- Release digital assets to buyers
- Real-time chat messaging and file uploads
- User authentication via Bybit API credentials
- Callback query handling for inline buttons

✅ **Web Miniapp**
- Cloudflare-hosted responsive interface
- Dashboard with real-time balance display
- Advertisement marketplace browsing
- Order tracking and management
- Payment type configuration
- Mobile-optimized UI (React)

✅ **Backend REST API**
- Express.js server with multi-user session management
- All P2P API endpoints exposed
- Secure credential storage (encrypted in SQLite)
- Rate limiting and request validation
- CORS support for Cloudflare Workers

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git
- SQLite3

### Installation (Termux)

```bash
pkg update && pkg upgrade
pkg install git nodejs python sqlite3 build-essential

git clone https://github.com/Aipeace/bybit-p2p-telegram-bot.git
cd bybit-p2p-telegram-bot

npm install
pip install -r requirements.txt

cp .env.example .env
```

### Running

**Terminal 1 - Backend:**
```bash
npm start
```

**Terminal 2 - Bot:**
```bash
python bot/bot.py
```

## API Endpoints

All endpoints require authentication via Bearer token

### Auth
- `POST /api/auth/login` - Login with Bybit credentials
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/logout` - Logout

### Ads
- `GET /api/ads/online` - Get all online ads
- `GET /api/ads/my-ads` - Get your ads
- `POST /api/ads/create` - Create new ad
- `PUT /api/ads/:id` - Update ad
- `DELETE /api/ads/:id` - Remove ad

### Orders
- `GET /api/orders` - List all orders
- `GET /api/orders/pending` - Get pending orders
- `POST /api/orders/:id/pay` - Mark as paid
- `POST /api/orders/:id/release` - Release assets

### Chat
- `GET /api/orders/:id/messages` - Get messages
- `POST /api/orders/:id/messages` - Send message
- `POST /api/orders/:id/files/upload` - Upload file

### User
- `GET /api/user/info` - Account info
- `GET /api/user/balance` - Check balance
- `GET /api/user/payments` - Payment methods

## Telegram Commands

- `/start` - Main menu
- `/auth` - Connect Bybit account
- `/balance` - Check balance
- `/my_ads` - List your ads
- `/create_ad` - Create advertisement
- `/pending_orders` - View pending orders
- `/my_orders` - All orders
- `/settings` - Configure settings
- `/help` - Help information

## Project Structure

```
.
├── README.md
├── package.json
├── requirements.txt
├── .env.example
├── backend/
│   ├── server.js
│   ├── config.js
│   ├── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── routes/
│       ├── auth.js
│       ├── ads.js
│       ├── orders.js
│       ├── user.js
│       └── chat.js
├── bot/
│   ├── bot.py
│   ├── handlers/
│   └── utils/
├── miniapp/
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx
│   │   └── App.css
│   └── wrangler.toml
└── data/
    └── users.db
```

## Security

⚠️ Never commit `.env` file
- Encrypt credentials in database
- Use secure session tokens
- Validate all inputs
- Rate limit all endpoints

## License

MIT
