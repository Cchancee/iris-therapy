# 📋 **IRIS Therapy Frontend**

This repository contains the frontend of the **IRIS Therapy** platform. The application connects patients and therapists, providing seamless scheduling, virtual therapy sessions, and art therapy resources.

---

## 🚀 **Getting Started**

Follow the steps below to get the frontend up and running on your local machine.

---

### ⚙️ **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **pnpm**
- A modern web browser

---

## 📂 **Clone the Repository**

```bash
git clone https://github.com/Cchancee/iris-therapy.git
cd iris-therapy
```
## 📥 Install Dependencies
#### Run the following command to install all necessary packages:

```bash
pnpm install
```

## 🔑 Environment Variables
#### Create a .env file in the root of the project and add the following variables:

```
VITE_API_URL = "https://iris-api-1zo6.onrender.com/" 
```


## 💻 Run the Development Server

#### Start the application locally:

``` 
pnpm run dev 
```

##### This will start the development server on http://localhost:5173/ (default for Vite).

## 📦 Build for Production
#### To create a production build of the application:

```
pnpm build
```

##### The build output will be available in the *dist/* directory.


## 🔧 Troubleshooting

###### Issue: 
```pnpm dev doesn’t work.```

##### Solution: 
Check if Node.js is installed and the version is compatible.
##### Issue: 
```Cannot connect to API.```

##### Solution: 
Ensure the backend server is running, and the **VITE_API_URL** in .env is correct.



