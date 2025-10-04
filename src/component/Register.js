import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  supabase  from '../supabaseClient.js';

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
      // Sign up with redirect for confirmation link
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://72.155.88.223/login', // redirect link
        },
      });

      if (signupError) {
        // If user already exists, try signing in
        if (signupError.message.includes('already registered')) {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email,
              password,
            });

          if (signInError) {
            setError(signInError.message);
          } else {
            setUser(signInData.user);
            setIsLoggedIn(true);
            navigate('/dashboard');
          }
        } else {
          setError(signupError.message);
        }
      } else {
        // New user created
        if (data.user && data.user.confirmation_sent_at) {
          setError(
            'Registration successful! Please check your email to confirm your account.'
          );
        } else {
          setUser(data.user);
          setIsLoggedIn(true);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Register</h2>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p
            style={{
              textAlign: 'center',
              marginTop: '20px',
              color: '#666',
            }}
          >
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;