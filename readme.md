EventPro - Professional MERN Event Management & Booking System

EventPro is a full-featured Event Management platform developed using the MERN stack. 
It provides a seamless experience for users to discover, book, and manage event tickets, complete with professional PDF generation and QR code security.

Key Features:
*User Authentication: Secure JWT-based login and registration system.

*Dynamic Event Discovery: Browse events with real-time availability and category filtering.

*Advanced Booking Engine: Atomic ticket inventory management to prevent overbooking.

*PDF Ticket Generation: Automated, professional PDF tickets created instantly upon booking.

*QR Code Integration: Unique QR codes embedded in every ticket for digital verification.

*Email Notifications: Automated SMTP mail service for booking confirmations and password resets.

*Admin Capabilities: Full control over event creation, seat management, and user bookings.

Tech Stack:
Frontend: React.js, Vite, Lucide React (Icons), CSS3 (Modern Responsive UI).

Backend: Node.js, Express.js.

Database: MongoDB Atlas (Mongoose ODM).

Services: Nodemailer (Email), jsPDF & html2canvas (PDF), QRCode.react.

Installation & Setup

1. Prerequisites
*Node.js installed on your machine.

*MongoDB Atlas account or local MongoDB instance.

*Gmail account (for SMTP email service).

2.Clone the Project

git clone https://github.com/Bhuvanms2005/EventBooking2.git
cd EventBooking2

3.Backend Configuration

*Navigate to the backend folder: cd backend

*Install dependencies: npm install

*Create a .env file and add the following:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password

4.Frontend Configuration
Navigate to the frontend folder: cd ../frontend

Install dependencies: npm install

Create a .env file and add:

VITE_API_URL=http://localhost:5000/api

5.Running the Application
Backend: npm run dev (from the backend folder)

Frontend: npm run dev (from the frontend folder)

6.License
This source code is provided under a Standard Commercial License. 
You are free to use it for personal or business applications. 
Reselling the original source code as a standalone product is prohibited.