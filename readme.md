
# **DrugDex-Server**

A powerful backend server for managing user data, drug information, and bookmark functionalities for the DrugDex ecosystem.

---

## 🛠️ **Overview**

The **DrugDex-Server** is a Node.js-based RESTful API server powered by Express and MongoDB. It serves as the backend for the DrugDex application, handling features like:

- User authentication and registration
- Drug data upload and search
- User bookmarks
- Username and password management

This server is designed for scalability, security, and seamless integration with the DrugDex frontend applications.

---

## 🚀 **Table of Contents**

- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Schema Definitions](#schema-definitions)
- [Contributing](#contributing)
- [Contact](#contact)

---

## ✨ **Features**

- **User Management**: Register, login, and manage user details.
- **Drug Data Management**:
  - Upload new drugs with detailed information.
  - Search for drugs by name.
- **Bookmark Management**: Add, remove, and fetch user bookmarks.
- **Admin Functionality** (Planned): Manage users and drug data securely.
- **Error Handling**: Comprehensive error responses for better debugging.
- **Security**:
  - Environment variable management.
  - Unique constraints for users and drug entries.

---

## 📚 **API Endpoints**

### **Base URL**: `http://localhost:5001`

#### **General**
- `GET /`  
  Returns a simple "Hello, World!" response.

#### **User Authentication**
- `POST /register-user`  
  Register a new user.
- `POST /login-user`  
  Log in an existing user.
- `GET /get-user`  
  Fetch user details (email and password).

#### **Drug Data**
- `POST /upload`  
  Upload a new drug.
- `GET /search-drug`  
  Search for a drug by name.

#### **Bookmark Management**
- `GET /show-bookmarks/:username`  
  Fetch all bookmarks for a user.
- `POST /add-bookmark`  
  Add a bookmark for a user.
- `POST /remove-bookmark`  
  Remove a bookmark for a user.
- `POST /check-bookmark`  
  Check if a drug is bookmarked by a user.

#### **User Management**
- `PUT /edit-username`  
  Update the username of a user.
- `PUT /edit-password`  
  Update the password of a user.

---

## 🛠️ **Technologies Used**

- **Node.js**: Runtime environment for building scalable server-side applications.
- **Express.js**: Web framework for routing and API handling.
- **MongoDB**: NoSQL database for storing user, admin, and drug data.
- **Mongoose**: ODM library for MongoDB schema management.
- **Cors**: Middleware for enabling cross-origin requests.
- **dotenv**: Securely handle environment variables.

---

## 🔧 **Installation**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kuzhanthaivel/drugdex-server.git
   cd drugdex-server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and define the following variables:
   ```env
   MONGO_URL=<your-mongodb-connection-string>
   PORT=5001
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```

   The server will run at `http://localhost:5001`.

---

## 🌐 **Environment Variables**

Ensure the following environment variables are defined in your `.env` file:

- `MONGO_URL`: Connection string for your MongoDB instance.
- `PORT`: Port number for the server (default is `5001`).

---

## 📋 **Schema Definitions**

### **User Schema**
```javascript
{
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bookmarks: { type: [String] }
}
```

### **Admin Schema**
```javascript
{
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referralId: { type: String, required: true },
    referredId: { type: String },
    myReferrals: { type: String },
    phoneNumber: { type: Number, required: true },
    bookmarks: { type: [String] }
}
```

### **Drug Data Schema**
```javascript
{
    drugName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    uses: { type: [String] },
    indications: { type: [String] },
    sideEffects: { type: [String] },
    warnings: { type: [String] }
}
```

---

## 🤝 **Contributing**

We welcome contributions to improve **DrugDex-Server**! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch-name
   ```
3. Make changes and commit:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-branch-name
   ```
5. Open a pull request on GitHub.

---

## 📧 **Contact**

For any questions or suggestions, reach out to:

- **Developer**: Kuzhanthaivel  
- **Email**: kuzhanthaivelu@example.com  
- **GitHub**: [Kuzhanthaivel](https://github.com/kuzhanthaivel)

--- 
