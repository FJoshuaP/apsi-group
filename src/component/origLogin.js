import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const Login = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      setIsLoggedIn(true);
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className ="auth-card">
        <div className="auth-header">
      <h2>Login</h2>
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
        <input 
          id="email"
          type="email" 
          placeholder="you@example.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        </div>
        <div className='form-group'>
          <label htmlFor="password">Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        </div>
        <button type="submit" className="btn-primary">Login</button>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={() => navigate('/register')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#6366f1', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Register here
          </button>
        </p>
      </form>
      </div>
    </div>
  );
};

export default Login;
