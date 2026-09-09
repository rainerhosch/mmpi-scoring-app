import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { getQuestions, submitAnswers } from '../api';

const TestPage = () => {
  const navigate = useNavigate();
  const { id: sessionId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = async (questionId, answer) => {
    // Record answer
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Next question or submit
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished all questions
      await handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    if (!sessionId) {
      alert('Sesi tidak valid.');
      navigate('/dashboard');
      return;
    }
    
    setSubmitting(true);
    try {
      // Format answers
      const answersList = Object.entries(finalAnswers).map(([qId, ans]) => ({
        question_id: parseInt(qId),
        answer: ans
      }));
      
      await submitAnswers(sessionId, answersList);
      navigate(`/result/${sessionId}`);
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Gagal menyimpan jawaban.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20vh' }}>Memuat Soal...</div>;
  }

  if (submitting) {
    return <div style={{ textAlign: 'center', marginTop: '20vh' }}>Menghitung Skor...</div>;
  }

  if (questions.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '20vh' }}>Tidak ada soal ditemukan.</div>;
  }

  const progressPercentage = ((currentIndex) / questions.length) * 100;

  return (
    <div>
      <div className="header">
        <p>Progres: {currentIndex} / {questions.length} Soal</p>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      <QuestionCard 
        question={questions[currentIndex]} 
        onAnswer={handleAnswer} 
      />
    </div>
  );
};

export default TestPage;
