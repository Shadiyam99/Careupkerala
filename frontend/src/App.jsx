import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import UserProfilePage from './pages/dashboard/UserProfilePage';
import CompanionDashboard from './pages/dashboard/CompanionDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import FindCompanionPage from './pages/FindCompanionPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/find-companion" element={<FindCompanionPage />} />
            <Route path="/dashboard/profile" element={<UserProfilePage />} />
            <Route path="/dashboard/companion" element={<CompanionDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;