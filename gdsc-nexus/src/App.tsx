import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import TeamChat from "./pages/TeamChat";
import Events from "./pages/Events";
import Announcements from "./pages/Announcements";
import Gallery from "./pages/Gallery";
import Membership from "./pages/Membership";
import Meetings from "./pages/Meetings";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import LearningTracks from "./pages/LearningTracks";
import PublicForm from "./pages/PublicForm";
import FieldDetail from "./pages/FieldDetail";
import FieldChat from "./pages/FieldChat";
import FieldMeetings from "./pages/FieldMeetings";
import LiveClass from "./pages/LiveClass";
import FormBuilder from "./pages/admin/FormBuilder";
import MembershipApplications from "./pages/admin/MembershipApplications";
import TeamManagement from "./pages/admin/TeamManagement";
import FieldManagement from "./pages/admin/FieldManagement";
import AttendanceDashboard from "./pages/admin/AttendanceDashboard";
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement";
import AlumniManagement from "./pages/admin/AlumniManagement";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:teamId" element={<TeamDetail />} />
            <Route path="/teams/:teamId/chat" element={<TeamChat />} />
            <Route path="/teams/:teamId/fields/:fieldId" element={<FieldDetail />} />
            <Route path="/teams/:teamId/fields/manage" element={<FieldManagement />} />
            <Route path="/events" element={<Events />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/forms/:slug" element={<PublicForm />} />

            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />


            {/* Authenticated Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Dashboard Route */}
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/chat" element={<Chat />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/learning" element={<LearningTracks />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

              {/* Field Pages */}
              <Route path="/fields/:fieldId/chat" element={<FieldChat />} />
              <Route path="/fields/:fieldId/meetings" element={<FieldMeetings />} />
              <Route path="/fields/:fieldId/class/:classId" element={<LiveClass />} />
              <Route path="/fields/:fieldId/attendance" element={<AttendanceDashboard />} />

              {/* Admin Pages */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/forms" element={<FormBuilder />} />
              <Route path="/admin/memberships" element={<MembershipApplications />} />
              <Route path="/admin/teams" element={<TeamManagement />} />
              <Route path="/admin/announcements" element={<AnnouncementsManagement />} />
              <Route path="/admin/alumni" element={<AlumniManagement />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
