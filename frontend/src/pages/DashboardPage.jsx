import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, getMySessions, startSession } from '../api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        const sessionData = await getMySessions();
        setSessions(sessionData);
      } catch (err) {
        console.error(err);
        // If unauthorized, redirect to login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('mmpi_token');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleStartNewTest = async () => {
    try {
      const session = await startSession();
      navigate(`/test/${session.session_id}`);
    } catch (err) {
      alert('Gagal memulai tes baru.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mmpi_token');
    navigate('/');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '10vh' }}>Loading Dashboard...</div>;

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '5vh auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: 0, color: 'var(--text-light)' }}>Selamat datang, {user?.name}</p>
        </div>
        <button className="btn btn-outline" onClick={handleLogout} style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={handleStartNewTest} style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
          + Mulai Tes Baru
        </button>
      </div>

      <h3>Riwayat Tes Anda</h3>
      {sessions.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '2rem' }}>Belum ada riwayat tes.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sessions.map((session, index) => (
            <div key={session.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Sesi #{sessions.length - index}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  Tanggal: {new Date(session.started_at).toLocaleString()}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  Status: <span style={{ fontWeight: 'bold', color: session.status === 'COMPLETED' ? 'var(--success-color)' : 'var(--warning-color)' }}>{session.status}</span>
                </div>
              </div>
              
              <div>
                {session.status === 'COMPLETED' && session.has_results ? (
                  <button className="btn btn-outline" onClick={() => navigate(`/result/${session.id}`)}>
                    Lihat Hasil
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => navigate(`/test/${session.id}`)}>
                    Lanjutkan Tes
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
