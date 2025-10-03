import React, { useState, useEffect } from 'react';
import './styles/App.css';
import supabase from './supabaseClient';

import Login from './component/Login';
import Register from './component/Register';
import TaskList from './component/TaskList';


function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
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

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <div className="app-header">
            <div className="header-content">
              <h1 className="app-title">Task Manager</h1>
              <button onClick={handleLogout} className="btn-logout">
                <span className="logout-icon">→</span>
                Logout
              </button>
            </div>
          </div>
          <TaskList />
        </>
      ) : (
        <>
          <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
          <Register setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
        </>
      )}
    </div>
  );
}

export default App;