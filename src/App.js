import React, { useState, useEffect } from 'react';
import './styles/App.css';
import supabase from './supabaseClient'; // Supabase client

import Login from './component/Login';
import Register from './component/Register';
import TaskList from './component/TaskList';
import TaskForm from './component/TaskForm';


function App() {
  const [user, setUser] = useState(null); // State for logged-in user
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  // Check if there's a logged-in user on app load
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
      }

      // Listen for auth state changes
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

  // Logout function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setIsLoggedIn(false);
      setUser(null); // Clear user data
    }
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <h2>Welcome, {user.email}</h2>
          <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
          <TaskForm />
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