# GDSC Nexus - Community Platform

GDSC Nexus is a comprehensive platform designed for Google Developer Student Clubs (GDSC) to manage members, facilitate communication, organize events, and showcase projects.

## Project Overview

The project is structured as a mono-repository with two main components:
- Backend: Built with NestJS, Prisma, and PostgreSQL.
- Frontend: Built with React, Vite, Tailwind CSS, and ShadCN UI.

## Architecture and Technology Stack

### Frontend (/gdsc-nexus)
- Framework: React 18 with Vite
- Styling: Tailwind CSS for responsive and modern UI
- Components: ShadCN UI (Radix UI)
- State Management: React Query (TanStack Query) for API synchronization
- Icons: Lucide React (used within the application)
- Theming: Next-themes for Light/Dark mode support
- Routing: React Router DOM

### Backend (/backend)
- Framework: NestJS (TypeScript)
- Database: PostgreSQL with Prisma ORM
- Real-time: Socket.io for live chat and notifications
- Authentication: JWT-based auth with Registration Number & Member ID
- File Storage: Cloudinary integration for images and voice notes
- Validation: Class-validator & Class-transformer

## Key Features

- Multi-Role Access Control: Includes roles for Admin, Faculty Head, Team Lead, and General Member.
- Real-time Communication: Persistent chat rooms, voice messages, and typing indicators.
- Dynamic Content Management: event scheduling, announcements, and an image gallery.
- Member Dashboard: Field-specific resources, attendance tracking, and profile management.
- Form Builder: Custom form creation for recruitment and feedback.
- Professional UI/UX: Premium design with full Dark Mode support.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL installed and running
- Cloudinary account for file storage and uploads

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Tayyab2344/GDSC-NEXUX.git
   cd GDSC-NEXUX
   ```

2. Backend Configuration:
   ```bash
   cd backend
   npm install
   # Create a .env file based on backend/.env.example
   # Required variables: DATABASE_URL, JWT_SECRET, CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   npm run start:dev
   ```

3. Frontend Configuration:
   ```bash
   cd ../gdsc-nexus
   npm install
   # Create a .env file based on gdsc-nexus/.env.example
   # Required variables: VITE_API_URL
   npm run dev
   ```

## Seeded Credentials

The database can be seeded with initial data using the `npm run seed` command in the backend directory. The following credentials are created for testing purposes.

Common Password for all seeded users: `password123`

### Administrative Accounts
- President: president@gdsc.dev
- Faculty Head: faculty@gdsc.dev

### Team Lead Accounts
- Web Development: webdevelopment.lead@gdsc.dev
- Mobile App Development: mobileappdevelopment.lead@gdsc.dev
- Game Development: gamedevelopment.lead@gdsc.dev
- AI/ML: aiml.lead@gdsc.dev
- Cloud Computing: cloudcomputing.lead@gdsc.dev
- Cyber Security: cybersecurity.lead@gdsc.dev
- UI/UX: uiux.lead@gdsc.dev
- Graphic Design: graphicdesign.lead@gdsc.dev
- Events Management: eventsmanagement.lead@gdsc.dev
- Marketing: marketing.lead@gdsc.dev
- Management: management.lead@gdsc.dev

### Co-Lead Accounts
- Web Development: webdevelopment.co@gdsc.dev
- Mobile App Development: mobileappdevelopment.co@gdsc.dev
- Game Development: gamedevelopment.co@gdsc.dev
- AI/ML: aiml.co@gdsc.dev
- Cloud Computing: cloudcomputing.co@gdsc.dev
- Cyber Security: cybersecurity.co@gdsc.dev
- UI/UX: uiux.co@gdsc.dev
- Graphic Design: graphicdesign.co@gdsc.dev
- Events Management: eventsmanagement.co@gdsc.dev
- Marketing: marketing.co@gdsc.dev
- Management: management.co@gdsc.dev

### General Member Accounts
- Each department also has 3 seeded members following the pattern: `[department-slug].mem[1-3]@gdsc.dev`
- Example: `webdevelopment.mem1@gdsc.dev`, `webdevelopment.mem2@gdsc.dev`, etc.

## Deployment

The project is configured for deployment on Render using the `render.yaml` blueprint.

1. Connect the GitHub repository to Render.
2. Configure environment variables in the Render Dashboard as specified in the `render.yaml` file.
3. The frontend and backend will be deployed and automatically connected.

## License

This project is licensed under the MIT License.
