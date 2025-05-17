# Express Backend 🔐

The Event management System backend. 🚀

## 📚 Table of Contents

- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Postman Testing](#postman-testing)
- [Folder Structure](#folder-structure)

---

## ⚙️ Technologies Used

- **Node.js** (Backend) 🖥️
- **Express** (Web Framework) 🛠️
- **Passport** (Authentication Middleware) 🔑
- **Express-Session** (Session Management) 🍪
- **MongoDB** (Database) 🗃️
- **TypeScript** (For type safety) 🏷️

![TypeScript Logo](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)
![Express Logo](https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png)

---

## 🚀 Setup Instructions

To set up the backend, follow the instructions below:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>/backend
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

```ini
NODE_ENV="development" or "production"
SERVER_PORT=
SERVER_HOST=
SESSION_SECRET=
FRONTEND_URL=

### database credentials
MONGO_USER=
MONGO_PASSWORD=
MONGO_DATABASE=
MONGO_APP_NAME=


RESET_PASSWORD_TOKEN_EXPIRY= 3600000 1 hour for example

# MAIL Service (used for sending the reset password mails)
MAIL_USER=
MAIL_PASSWORD=  # APP PASSWORD generated from google account if using gmail
MAIL_SERVICE= "gmail" or any other used main service

```

### 4. Start the Development Server

To start the server in development mode, use the following command:

```bash
npm run start:dev
```

For production, you can start the server with:

```bash
npm start
```
