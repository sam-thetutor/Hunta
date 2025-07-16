import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppWrapper } from './components/AppWrapper';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';

function App() {
  return (
    <AuthProvider>
      <AppWrapper>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              {/* Public route - shows landing page when not authenticated */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Protected routes - only accessible when authenticated */}
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Redirect to home if no route matches */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </div>
        </Router>
      </AppWrapper>
    </AuthProvider>
  );
}

export default App; 