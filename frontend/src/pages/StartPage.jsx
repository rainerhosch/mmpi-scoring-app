import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, startSession } from '../api';

const StartPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'M',
    address: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob) return;
    
    setLoading(true);
    try {
      const user = await createUser(formData);
      const session = await startSession(user.id);
      
      // Store session id to local storage
      localStorage.setItem('mmpi_session_id', session.session_id);
      
      // Navigate to test page
      navigate('/test');
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Gagal memulai sesi. Pastikan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: 'auto' }}>
      <div className="header">
        <h1>MMPI Scoring</h1>
        <p>Minnesota Multiphasic Personality Inventory</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nama Lengkap</label>
          <input 
            type="text" 
            name="name"
            className="form-control" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="Masukkan nama"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Tanggal Lahir</label>
          <input 
            type="date" 
            name="dob"
            className="form-control" 
            value={formData.dob} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Jenis Kelamin</label>
          <select 
            name="gender" 
            className="form-control" 
            value={formData.gender} 
            onChange={handleChange}
          >
            <option value="M">Laki-laki</option>
            <option value="F">Perempuan</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Alamat</label>
          <input 
            type="text" 
            name="address"
            className="form-control" 
            value={formData.address} 
            onChange={handleChange} 
            placeholder="Masukkan alamat"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            name="email"
            className="form-control" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Masukkan email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">No Hp</label>
          <input 
            type="text" 
            name="phone"
            className="form-control" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Masukkan no handphone"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Memulai...' : 'Mulai Tes'}
        </button>
      </form>
    </div>
  );
};

export default StartPage;
