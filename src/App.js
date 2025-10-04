import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import supabase from './supabaseClient';

import Login from './component/origLogin';
import Register from './component/Register';
import TaskList from './component/origtasklist';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          setIsLoggedIn(true);
        }

        supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setUser(session.user);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        });
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
              )
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

// Dashboard component for logged-in users
function Dashboard({ user, onLogout }) {
  return (
    <>
      <div className="app-header">
        <div className="header-content">
          <h1 className="app-title">Task Manager</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              Welcome, {user?.email}
            </span>
            <button onClick={onLogout} className="btn-logout">
              <span className="logout-icon">→</span>
              Logout
            </button>
          </div>
        </div>
      </div>
      <TaskList />
    </>
  );
}

export default App;