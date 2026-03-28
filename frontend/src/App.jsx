import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Dashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Subscription from "./pages/user/Subscription";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const auth = useAuth();

  if (!auth) {
    console.error("AuthProvider not found in ProtectedRoute");
    return null;
  }

  const { user, loading } = auth;

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-emerald-500">
        Loading Session...
      </div>
    );

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" />;

  return children;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500 selection:text-black">
      <Navbar />
      <Suspense fallback={<div>Loading Page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscribe"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
