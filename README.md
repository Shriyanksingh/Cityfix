# CityFix 🏙️

CityFix is a **Civic Issue Tracker** designed for citizens to instantly report localized problems (e.g., potholes, graffiti, broken streetlights) and for city officials to triage and manage statuses. Built with a stunning dark-theme glassmorphism interface.

## ✨ Features
- **Interactive Mapping:** Powered by [Leaflet](https://leafletjs.com/), users can visually pinpoint issue locations or automatically drop pins using browser **Geolocation APIs**.
- **Media Uploads:** Cloud-synced image uploads hosted directly by **Cloudinary**.
- **Issue Workflow System:** Robust backend tracking states (Open → In Progress → Resolved) strictly modeled using Mongoose schemas.
- **Admin Dashboard:** Secure data-table Command Center for verified officials to manage incoming tickets.
- **Upvote Mechanics:** Citizens can anonymously upvote severe issues to push their priority.
- **Fully Responsive:** Sleek, mobile-first design with bottom-swiping navigation drawers overlapping the viewport perfectly on small UI breakpoints.

## 🚀 Tech Stack
- **Frontend**: React (Vite), TailwindCSS v4, React-Leaflet, Axios, Context API.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer, Cloudinary.

## 🛠️ Local Installation Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cityfix.git
   cd cityfix
   ```

2. **Backend Setup:**
   Open a terminal and navigate to the `server` folder.
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file inside the `server` directory and add the following keys:
   ```env
   PORT=5000
   MONGO_URI=mongodb_srv_string
   JWT_SECRET=any_secret_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   ```
   Start the backend development server:
   ```bash
   npm run dev
   # Or "node server.js"
   ```

3. **Frontend Setup:**
   Open a separate terminal and navigate to the `client` folder.
   ```bash
   cd client
   npm install
   ```
   Start the Vite frontend development UI:
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`.
