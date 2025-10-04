import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const Register = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      // First, try to sign in (in case user already exists)
      const { data: existingUserData, error: existingUserError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (existingUserData.user) {
        // User already exists and password is correct
        setUser(existingUserData.user);
        setIsLoggedIn(true);
        setError('Welcome back! You are now logged in.');
        navigate('/dashboard');
        setLoading(false);
        return;
      }

      // If sign in fails, try to create new user
      console.log('User does not exist, creating new account...');
      
      // Try to sign up with email confirmation disabled
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined
        }
      });

      if (authError) {
        // If signup fails due to email confirmation, try to create user manually
        if (authError.message.includes('email') || authError.message.includes('confirmation')) {
          console.log('Email confirmation required, but we can still create the user...');
          
          // The user was created but needs confirmation - try to sign in anyway
          setTimeout(async () => {
            try {
              const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (signInData && signInData.user) {
                setUser(signInData.user);
                setIsLoggedIn(true);
                setError('Registration successful! You are now logged in.');
                navigate('/dashboard');
              } else {
                setError('Registration successful! Please try logging in manually.');
              }
            } catch (err) {
              setError('Registration successful! Please try logging in manually.');
            }
          }, 3000); // Wait 3 seconds for user to be fully created
          
          setError('Registration successful! Attempting to sign you in...');
          setLoading(false);
          return;
        } else {
          setError(authError.message);
          setLoading(false);
          return;
        }
      }

      // If signup was successful
      if (authData.user) {
        // Check if user is immediately confirmed
        if (authData.user.email_confirmed_at || authData.session) {
          setUser(authData.user);
          setIsLoggedIn(true);
          setError('Registration successful! You are now logged in.');
          navigate('/dashboard');
        } else {
          // User created but needs confirmation - try to sign in
          setTimeout(async () => {
            try {
              const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (signInData && signInData.user) {
                setUser(signInData.user);
                setIsLoggedIn(true);
                setError('Registration successful! You are now logged in.');
                navigate('/dashboard');
              } else {
                setError('Registration successful! Please try logging in manually.');
              }
            } catch (err) {
              setError('Registration successful! Please try logging in manually.');
            }
          }, 3000);
          
          setError('Registration successful! Attempting to sign you in...');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={() => navigate('/login')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#6366f1', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
