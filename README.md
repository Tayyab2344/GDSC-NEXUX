# GDSC Nexus - Community Platform

GDSC Nexus is a comprehensive platform designed for Google Developer Student Clubs (GDSC) to manage members, facilitate communication, organize events, and showcase projects.

## 🚀 Project Overview

The project is structured as a mono-repository with two main components:
- **Backend**: Built with **NestJS**, **Prisma**, and **PostgreSQL**.
- **Frontend**: Built with **React**, **Vite**, **Tailwind CSS**, and **ShadCN UI**.

---

## 🏗️ Architecture & Stack

### Frontend (`/gdsc-nexus`)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS for responsive and modern UI
- **Components**: ShadCN UI (Radix UI)
- **State Management**: React Query (TanStack Query) for API synchronization
- **Icons**: Lucide React
- **Theming**: Next-themes for Light/Dark mode support
- **Routing**: React Router DOM

### Backend (`/backend`)
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io for live chat and notifications
- **Authentication**: JWT-based auth with Registration Number & Member ID
- **File Storage**: Cloudinary integration for images and voice notes
- **Validation**: Class-validator & Class-transformer

---

## ✨ Key Features

- **Multi-Role Access Control**: 
  - Admin (System configurations)
  - Faculty Head (Supervision)
  - Team Lead (Field & Class management)
  - General Member (Learning & Participation)
- **Real-time Communication**: 
  - Persistent Chat Rooms (Public/Private)
  - **Voice Messages** with custom waveform UI
  - Real-time typing indicators
- **Dynamic Content Management**:
  - Event Scheduling & Tracking
  - Dynamic Announcements
  - Image Gallery
- **Member Dashboard**:
  - Field-specific resources and classes
  - Attendance tracking
  - Personalized profile management
- **Form Builder**: Custom form creation for recruitment and feedback.
- **UI/UX**: Premium design with full Dark Mode support and dynamic page titles.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running
- Cloudinary Account (for file uploads)

### Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/Tayyab2344/GDSC-NEXUX.git
   cd GDSC-NEXUX
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file based on backend/.env.example
   npx prisma generate
   npx prisma migrate dev
   npm run seed # To populate initial roles and data
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../gdsc-nexus
   npm install
   # Create a .env file based on gdsc-nexus/.env.example
   npm run dev
   ```

---

## 🚀 Deployment

This monorepo is ready for deployment on **Render** using the provided `render.yaml` Blueprint.

### Steps to Deploy:
1. Connect your GitHub repository to Render.
2. Render will detect the `render.yaml` and prompt you to create the services.
3. Configure the following **Environment Variables** in the Render Dashboard:
   - **Backend (`gdsc-nexus-backend`)**:
     - `DATABASE_URL`: Your Neon/PostgreSQL connection string.
     - `JWT_SECRET`: A secure random string for signing tokens.
     - `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Your Cloudinary credentials.
   - **Frontend (`gdsc-nexus-frontend`)**:
     - `VITE_API_URL`: Set automatically by the blueprint to your backend's URL.

4. Once deployed, the frontend will automatically connect to the backend via the synchronized `VITE_API_URL`.

---

## 💻 Screenshots & Demo

*(Add screenshots here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
