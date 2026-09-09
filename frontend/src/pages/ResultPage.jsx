import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResults } from '../api';
import ResultChart from '../components/ResultChart';

const ResultPage = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!sessionId) {
          alert('Tidak ada sesi yang aktif.');
          return;
        }
        const data = await getResults(sessionId);
        setResult(data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20vh' }}>Memuat Hasil...</div>;
  }

  if (!result) {
    return <div style={{ textAlign: 'center', marginTop: '20vh' }}>Data hasil tidak ditemukan.</div>;
  }

  return (
    <div className="card" style={{ maxWidth: '800px', margin: 'auto' }}>
      <div className="header">
        <h1>Hasil Tes MMPI</h1>
        {result.valid ? (
          <div style={{ padding: '1rem', backgroundColor: 'var(--success-color)', color: 'white', borderRadius: 'var(--radius-md)', display: 'inline-block', fontWeight: 'bold' }}>
            Profil Valid
          </div>
        ) : (
          <div style={{ padding: '1rem', backgroundColor: 'var(--danger-color)', color: 'white', borderRadius: 'var(--radius-md)', display: 'inline-block', fontWeight: 'bold' }}>
            INVALID / Profile Uninterpretable
          </div>
        )}
      </div>

      <ResultChart tScores={result.t_scores} />

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
