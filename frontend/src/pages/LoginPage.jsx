import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      localStorage.setItem('mmpi_token', data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '10vh auto' }}>
      <div className="header">
        <h1>Masuk</h1>
        <p>Aplikasi Scoring MMPI</p>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            name="email"
            className="form-control" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            name="password"
            className="form-control" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Belum punya akun? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Daftar sekarang</Link>
      </div>
    </div>
  );
};

export default LoginPage;
