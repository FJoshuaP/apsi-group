import React, { useState } from 'react';
import supabase from '../supabaseClient';

const Register = ({ setIsLoggedIn, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    try {
      // First try to sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Registration error:', error);
        // If signup fails due to email confirmation, try to sign in instead
        if (error.message.includes('email') || error.message.includes('confirmation')) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            setError('Registration failed. Please try again.');
          } else {
            setUser(signInData.user);
            setIsLoggedIn(true);
            setError('Registration successful! You are now logged in.');
          }
        } else {
          setError(error.message);
        }
      } else {
        console.log('Registration data:', data);
        // Force login the user regardless of email confirmation status
        if (data.user) {
          setUser(data.user);
          setIsLoggedIn(true);
          setError('Registration successful! You are now logged in.');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <h3>Register</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
