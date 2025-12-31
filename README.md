# 💥 ONLYONCE - Self-Destructing Messages

Send messages that automatically delete after being viewed once. Perfect for sharing secrets, passwords, or private information securely.

![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub%20Pages-blue)
![Firebase](https://img.shields.io/badge/Powered%20By-Firebase-orange)
![Self-Destruct](https://img.shields.io/badge/Self--Destruct-Enabled-red)

## 🚀 Live Demo

**[👉 Use the App Here](https://yashpatil117.github.io/ONLYONCE/)**

## ✨ Features

- **One-Time View** - Messages disappear forever after being opened
- **Public & Private** - Choose between public wall or private link-only messages
- **Image Support** - Send self-destructing images (Firebase Storage required)
- **Instant Deletion** - Automatic cleanup after reading
- **Mobile Friendly** - Works perfectly on all devices
- **No Login Required** - Simple and anonymous

## 🎯 How It Works

1. **Create** - Write your message and choose public or private
2. **Share** - Get a unique link for private messages  
3. **View** - Recipient opens the message once
4. **💥 BOOM** - Message self-destructs automatically

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Firebase Firestore & Storage
- **Hosting**: GitHub Pages
- **Styling**: Custom CSS with modern design



## 🚀 Usage

### Creating Messages
1. Visit the [live app](https://yashpatil117.github.io/ONLYONCE/)
2. Type your secret message
3. Add an image (optional)
4. Choose visibility:
   - **Public**: Appears on message wall
   - **Private**: Share via unique link only
5. Click "Create Self-Destruct Message"

### Viewing Messages
- **Public**: Click any message from the wall
- **Private**: Open the shared link
- ⚠️ **Warning**: Messages delete immediately after viewing!

## 🔧 Local Development

```bash
# Clone the repository
git clone https://github.com/YashPatil117/ONLYONCE.git

# Open index.html in your browser
# Or use a local server:
python -m http.server 8000
