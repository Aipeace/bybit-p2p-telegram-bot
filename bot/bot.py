#!/usr/bin/env python3
"""
Multi-user Telegram Bot for Bybit P2P Trading
"""

import os
import sys
import logging
from dotenv import load_dotenv
import telebot

load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize bot
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
if not BOT_TOKEN:
    logger.error('TELEGRAM_BOT_TOKEN not set in .env')
    sys.exit(1)

bot = telebot.TeleBot(BOT_TOKEN)

logger.info(f'Bot initialized: @{bot.get_me().username}')

# Commands
@bot.message_handler(commands=['start'])
def send_welcome(message):
    """Handle /start command"""
    chat_id = message.chat.id
    username = message.from_user.username or message.from_user.first_name
    logger.info(f'User {username} ({chat_id}) started bot')
    
    welcome_text = f'''👋 Welcome to Bybit P2P Bot, {username}!

I'll help you manage your P2P trading with Bybit.

📋 Available Commands:
/auth - Connect your Bybit API credentials
/balance - Check your account balance
/my_ads - View your advertisements
/create_ad - Create new advertisement
/pending_orders - View pending orders
/my_orders - View all orders
/settings - Configure payment methods
/help - Show help information
'''
    bot.reply_to(message, welcome_text)

@bot.message_handler(commands=['help'])
def send_help(message):
    """Handle /help command"""
    help_text = '''📚 Help Guide

🔐 Authentication:
/auth - Set your Bybit API credentials

💰 Balance:
/balance - Check your available balance

📢 Advertisements:
/my_ads - List your active ads
/create_ad - Create a new P2P ad

📦 Orders:
/pending_orders - View pending transactions
/my_orders - View all your orders

⚙️ Settings:
/settings - Configure payment methods

ℹ️ For more help, visit:
https://bybit-exchange.github.io/docs/p2p/guide
'''
    bot.reply_to(message, help_text)

@bot.message_handler(commands=['auth'])
def handle_auth(message):
    """Handle /auth command"""
    chat_id = message.chat.id
    auth_text = '''🔐 API Authentication

To connect your Bybit account:

1. Go to https://www.bybit.com/user/api-management
2. Create new API key with these permissions:
   - P2P: Read & Write
3. Send me your credentials in this format:

API_KEY|API_SECRET

⚠️ Keep your API secret safe!
'''
    bot.send_message(chat_id, auth_text)

@bot.message_handler(commands=['balance'])
def check_balance(message):
    """Handle /balance command"""
    chat_id = message.chat.id
    logger.info(f'User requested balance: {chat_id}')
    
    balance_text = '''💰 Account Balance

(Balance data will be fetched from API)

USDT: 0.00
BTC: 0.00
ETH: 0.00
'''
    bot.send_message(chat_id, balance_text)

@bot.message_handler(commands=['my_ads'])
def list_ads(message):
    """Handle /my_ads command"""
    chat_id = message.chat.id
    logger.info(f'User requested ads: {chat_id}')
    
    ads_text = '''📢 Your Advertisements

(No active ads)

Use /create_ad to post a new advertisement
'''
    bot.send_message(chat_id, ads_text)

@bot.message_handler(commands=['pending_orders'])
def list_pending_orders(message):
    """Handle /pending_orders command"""
    chat_id = message.chat.id
    logger.info(f'User requested pending orders: {chat_id}')
    
    orders_text = '''⏳ Pending Orders

(No pending orders)
'''
    bot.send_message(chat_id, orders_text)

@bot.message_handler(commands=['create_ad'])
def create_ad(message):
    """Handle /create_ad command"""
    chat_id = message.chat.id
    
    create_text = '''📝 Create Advertisement

Provide details in this format:

COIN SIDE QUANTITY PRICE

Example:
USDT sell 100 100.50

Parameters:
- COIN: USDT, USDC, BTC, ETH, etc.
- SIDE: buy or sell
- QUANTITY: Amount to trade
- PRICE: Price per unit
'''
    bot.send_message(chat_id, create_text)

@bot.message_handler(commands=['settings'])
def show_settings(message):
    """Handle /settings command"""
    chat_id = message.chat.id
    
    settings_text = '''⚙️ Settings

1. 💳 Payment Methods
2. 🔔 Notifications
3. 🌐 Preferred Currency
4. ⏰ Auto-Release Orders

(Coming soon in web interface)
'''
    bot.send_message(chat_id, settings_text)

@bot.message_handler(func=lambda message: True)
def handle_other(message):
    """Handle any other message"""
    default_text = '''❓ Unknown command

Use /help to see available commands
'''
    bot.reply_to(message, default_text)

if __name__ == '__main__':
    logger.info('🚀 Starting bot polling...')
    try:
        bot.infinity_polling()
    except KeyboardInterrupt:
        logger.info('Bot stopped by user')
        sys.exit(0)
    except Exception as e:
        logger.error(f'Fatal error: {e}')
        sys.exit(1)
