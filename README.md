# CalmConnect Frontend

A modern, responsive frontend for **CalmConnect**, an online therapy platform that connects users with certified psychologists for secure video-based counselling sessions.

---

## 🌿 Overview

CalmConnect frontend provides a seamless user experience for booking therapy sessions, attending video consultations, managing payments, and handling user complaints. It is designed with a clean, intuitive UI focused on accessibility, performance, and emotional comfort.

---

## 🚀 Project Highlights

- Built a full-scale multi-role platform for online therapy services
- Designed end-to-end system including onboarding, booking, payments, and consultations
- Implemented real-time video communication using WebRTC with NAT traversal support
- Developed secure role-based authentication and access control for User, Psychologist, and Admin
- Integrated Razorpay for seamless payment and wallet management system with refund handling
- Built admin moderation system for psychologist verification and complaint resolution
- Optimized for real-world scalability with reusable components and service-based API layer
---

## ✨ Features

###  User Features

- Book sessions
- Attend sessions (video call)
- rate psychologist or raise complaints against psychologist
- Track sessions ,payments etc.

###  Psychologist Features

- Apply to become a verified psychologist
- Manage availability
- Accept and manage scheduled sessions
- Conduct video sessions with users
  
###  Admin Features

- Verify psychologist applications
- Resolve complaints from users
- Track sessions,psychologists,users


###  Real Time Experience

- Real-time video calls (WebRTC-based backend integration)
- In-call chat support
- Real time notifications
 

---

## 🧱 Tech Stack

- **Frontend:** React+Typescript+Vite
- **Language:** TypeScript
- **State Management:** Redux Toolkit / Context API (as applicable)
- **Styling:** Tailwind CSS
- **Real-time Communication:** WebSocket integration
- **Video Calls:** WebRTC integration (backend supported)
- **API Communication:** REST APIs
- **Icons:** Lucide react

## 📂 Project Structure
```
src/
├── assets/
├── components/
├── constants/
├── contexts/
├── features/
├── hooks/
├── pages/
├── services/
├── types/
└── utils/
```
## ⚙️ Installation & Setup

### 1. Clone the repository

git clone https://github.com/gokulrl-developer/calmconnect-frontend.git

### 2. Install dependencies

npm install

### 3. Setup environment variables
Create a `.env` file and add environment varables as shown below.

### 4. Run the development server

npm run dev

## 🌐 Environment Variables

| Variable | Description |
|----------|------------|
| VITE_API_URL | Frontend API URL (backend base URL used by frontend) |
| VITE_RAZORPAY_KEY_ID | Razorpay public key used for payment integration |
| VITE_STUN_SERVERS | STUN servers used for WebRTC peer-to-peer video calling (helps with NAT traversal) |
| VITE_GOOGLE_CLIENT_ID | Google OAuth Client ID for authentication |
| VITE_GOOGLE_CLIENT_REDIRECT_URI | Redirect URI used after Google OAuth login callback |
---

## 📸 Screenshots

> Screenshots are grouped by feature flow to avoid clutter and improve clarity.

### Psychologist Application
<img width="1358" height="1665" alt="www calm-connect site_psychologist_application" src="https://github.com/user-attachments/assets/69323c1e-b588-47e8-a78b-bce3bab96b4b" />

### Availability Setting by Psychologist
<img width="45%" height="594" alt="Screenshot 2026-05-02 165212" src="https://github.com/user-attachments/assets/eccc26a9-4f09-45b7-b2ad-786fc318d11a" />
<img width="45%" height="565" alt="Screenshot 2026-05-02 165344" src="https://github.com/user-attachments/assets/2f5f81f8-d5c5-446c-ab77-383d18e91b18" />


### Book Session by User
<img width="1346" height="587" alt="Screenshot 2026-05-02 165638" src="https://github.com/user-attachments/assets/b9e277be-e956-4b9f-9f6f-943b2ad05dd7" />


### Sessions Page
<img width="1313" height="585" alt="Screenshot 2026-05-02 170329" src="https://github.com/user-attachments/assets/945ebf20-d3f9-4e98-98d9-61ac3cc1c4aa" />


### Sessions :psychologist and user
<img width="1358" height="597" alt="Screenshot 2026-05-02 190855" src="https://github.com/user-attachments/assets/b8fb6adf-7a16-4494-be0c-45a3eb5073e5" />

### Complaint Resolution by Admin
<img width="1084" height="1018" alt="www calm-connect site_admin_complaints_699338e7888763632f3e5e25" src="https://github.com/user-attachments/assets/dd4f39d5-e7b9-4369-a265-1cd46d1f2a2a" />



---

## 🔄 Core System Workflows

### 1. Psychologist Application & Verification Flow
Psychologist registers on the platform → submits required documents (certificates, license, ID proof) → application is stored in pending state → admin reviews application → admin either approves or rejects → upon approval, psychologist gains access to dashboard features (availability, sessions, consultations).

---

### 2. Booking & Payment Flow (User → System)
User selects a psychologist → views available slots → selects a slot → completes Razorpay payment → session is instantly created and locked → confirmation is shown in Sessions page.

---

### 3. Session Lifecycle (WebRTC Consultation)
User joins scheduled session → WebRTC connection is established → real-time video + chat session runs → session ends -> user can rate and raise complaint against the psychologist

---

### 4. Availability Management (Psychologist Side)
Psychologist defines weekly availability ,override slots for special days and create quick slots → slots are generated → users can book only from available slots → booked slots are automatically removed/locked.

---

### 5. Complaint Management Flow
User raises complaint against a psychologist he has consulted → complaint is sent to admin → admin reviews user, psychologist, and session context → resolution is recorded and is sent to both user and psychologists.

---

### 6. Wallet & Refund Flow
All payments are tracked in wallet → successful sessions remain as transactions → failed/cancelled sessions trigger refunds → refunds are credited back to wallet and visible in transaction history.


---
## 🔗 API Reference

Backend Repository: https://github.com/gokulrl-developer/calmconnect-backend.git

## 🚀 Deployment

This project is deployed on Vercel.

Live URL: https://calm-connect.site

## 🤝 Contributing

This is a personal portfolio project and is not open for contributions.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Gokul R.L

github profile: https://github.com/gokulrl-developer






