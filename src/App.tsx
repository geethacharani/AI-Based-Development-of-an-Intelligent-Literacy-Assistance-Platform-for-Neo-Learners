import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { DiagnosticAssessmentPage } from './pages/DiagnosticAssessmentPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { LearningPathPage } from './pages/LearningPathPage';
import { VoiceLearningPage } from './pages/VoiceLearningPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PuzzlesAndGamesPage } from './pages/PuzzlesAndGamesPage';
import { DatabaseExplorerPage } from './pages/DatabaseExplorerPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LearnerLayout } from './components/layout/LearnerLayout';
import { MissionsPage } from './pages/MissionsPage';
import { LearnFromImagePage } from './pages/LearnFromImagePage';
import { LingoCityPage } from './pages/LingoCityPage';
import { DressLingoBotPage } from './pages/DressLingoBotPage';
import { DailyChallengePage } from './pages/DailyChallengePage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

// Public Route (redirects to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

// Admin-only Route Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const AppContent: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return (
            <Routes>
                {/* Admin Dashboard — fullscreen */}
                <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />

                {/* Learner App — Full width, no sidebar, top learning options, bottom Account & More */}
                <Route element={<LearnerLayout />}>
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/assessment" element={<ProtectedRoute><DiagnosticAssessmentPage /></ProtectedRoute>} />
                    <Route path="/insights" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
                    <Route path="/games" element={<ProtectedRoute><PuzzlesAndGamesPage /></ProtectedRoute>} />
                    <Route path="/learning-path" element={<ProtectedRoute><LearningPathPage /></ProtectedRoute>} />
                    <Route path="/voice-learning" element={<ProtectedRoute><VoiceLearningPage /></ProtectedRoute>} />
                    <Route path="/database" element={<ProtectedRoute><DatabaseExplorerPage /></ProtectedRoute>} />
                    
                    {/* Core Immersion & Multi-Modal Learning Routes */}
                    <Route path="/missions" element={<ProtectedRoute><MissionsPage /></ProtectedRoute>} />
                    <Route path="/real-world-communication" element={<ProtectedRoute><MissionsPage /></ProtectedRoute>} />
                    <Route path="/learn-from-image" element={<ProtectedRoute><LearnFromImagePage /></ProtectedRoute>} />
                    <Route path="/lingo-city" element={<ProtectedRoute><LingoCityPage /></ProtectedRoute>} />
                    <Route path="/lingobot" element={<ProtectedRoute><DressLingoBotPage /></ProtectedRoute>} />
                    <Route path="/daily-challenge" element={<ProtectedRoute><DailyChallengePage /></ProtectedRoute>} />
                    
                    {/* Safe redirects for legacy bookmarks */}
                    <Route path="/reading-library" element={<Navigate to="/lingo-city" replace />} />
                    <Route path="/mistake-review" element={<Navigate to="/lingo-city" replace />} />
                    
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-surface-light">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
