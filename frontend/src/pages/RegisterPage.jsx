import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'M',
    address: '',
    email: '',
    phone: '',
    password: ''
  });
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
      await register(formData);
      alert('Pendaftaran berhasil! Silakan login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '5vh auto' }}>
      <div className="header">
        <h1>Daftar Akun</h1>
        <p>Aplikasi Scoring MMPI</p>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nama Lengkap</label>
          <input type="text" name="name" className="form-control" onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Tanggal Lahir</label>
          <input type="date" name="dob" className="form-control" onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Jenis Kelamin</label>
          <select name="gender" className="form-control" onChange={handleChange}>
            <option value="M">Laki-laki</option>
            <option value="F">Perempuan</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Alamat</label>
          <input type="text" name="address" className="form-control" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">No Hp</label>
          <input type="text" name="phone" className="form-control" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" onChange={handleChange} required />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Sudah punya akun? <Link to="/" style={{ color: 'var(--primary-color)' }}>Login di sini</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
