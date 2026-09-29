# TruckLink 🚛 — Smart Freight & Logistics Network

**TruckLink** is a full-stack web-based logistics and freight management platform that connects truck drivers/owners with businesses and manufacturers needing freight transportation services across Gujarat and India.

Built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with real-time **Socket.IO** synchronization, modern **Tailwind CSS** styling, and smooth **Framer Motion** animations.

---

## 🌟 Key Features

- **Public Landing Page**: Sticky navbar, hero with motion parallax, services showcase, 4-step horizontal process timeline, searchable Gujarat & India service location directory (stored in MongoDB), customer reviews, and contact form.
- **Dual Role Workflows**: Role-based access control for **Truck Driver / Truck Owner** vs **Company / Business Owner**.
- **Role Switching**: Smooth switching between Driver and Company profiles for dual-role users (with prompt to create missing profile if unlinked).
- **Fleet Availability Manager**: Drivers post availability (Route, Origin, Destination, Max Tonnage, Dates, Material Type) -> Broadcast live via Socket.IO.
- **Available Fleet Explorer**: Companies search & filter available drivers by city, route, truck type, capacity (Tons), rating, and availability status.
- **Dynamic Price Estimator**: Interactive freight price calculator considering base fare, simulated route distance, cargo weight, and truck type multiplier.
- **Manual Delivery Checkpoints**: Drivers log transit milestones (`Surat ✓ -> Bharuch ✓ -> Vadodara ✓ -> Vapi ✓ -> Mumbai ✓`) with timestamp and notes, synced live to the company tracking screen via Socket.IO.
- **Demo Payment Portal**: Simulated payments (`Demo Card: 4111 1111 1111 1111`, `Demo UPI`, `Demo Wallet`) updating booking payment status.
- **Driver Rating & Reviews**: Post-delivery company reviews with automatic driver average rating recalculation in MongoDB.
- **Zero-Config Database Fallback**: Automatic MongoDB Memory Server fallback if no local MongoDB service is running.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, React Router DOM, Tailwind CSS, Framer Motion, Lucide Icons, Socket.IO Client, Axios
- **Backend**: Node.js, Express.js, Socket.IO Server, JWT, bcryptjs, Mongoose
- **Database**: MongoDB (with MongoDB Memory Server fallback)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### 1. Backend Setup
```bash
cd server
npm install
npm run seed     # Seed 10+ demo drivers, 5+ companies, 20+ service locations
npm run dev      # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Base Route |
| :--- | :--- | :--- | :--- |
| **Driver / Truck Owner** | `rahul.driver@trucklink.com` | `password123` | Surat → Mumbai |
| **Driver / Heavy Truck** | `amit.driver@trucklink.com` | `password123` | Ahmedabad → Vadodara |
| **Company Owner (Textiles)** | `contact@abctextiles.com` | `password123` | Surat, Gujarat |
| **Company Owner (Mfg)** | `logistics@gujaratmfg.com` | `password123` | Vadodara, Gujarat |

*Note: 1-Click Demo Login buttons are also available on the `/login` page.*

---

## 🔄 End-to-End Verification Scenario

1. **Company Login**: Log in as `contact@abctextiles.com`.
2. **Find Driver**: Go to **Available Fleet**, find driver **Rahul Patel** (15 Ton Medium Truck, `Surat → Mumbai`).
3. **Request Booking**: Click **Request Booking**, fill in shipment details, review the estimated price, and submit.
4. **Driver Accepts**: Log in as `rahul.driver@trucklink.com` (or use dual-role switch button), navigate to **Incoming Requests**, and click **Accept Booking**.
5. **Driver Adds Checkpoints**: Navigate to **Active Delivery** and add a checkpoint (e.g. `Vadodara`).
6. **Live Sync to Company**: Switch back to Company profile -> Open **Active Deliveries** to see the new checkpoint `Vadodara ✓` reflected live without reloading!
7. **Complete & Pay**: Driver marks destination arrival -> Company opens **My Bookings** -> Clicks **Process Demo Payment** -> Submits a **5-Star Driver Review**.
8. **Rating Updated**: Driver's average rating is automatically recalculated in MongoDB!
