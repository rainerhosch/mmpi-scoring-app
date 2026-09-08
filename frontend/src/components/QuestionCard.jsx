import React from 'react';

const QuestionCard = ({ question, onAnswer }) => {
  return (
    <div className="card" style={{ maxWidth: '600px', margin: 'auto' }}>
      <div className="question-container">
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Soal No. {question.question_no}
        </div>
        
        <h2 className="question-text">
          "{question.text}"
        </h2>
        
        <div className="options-container">
          <button 
            className="option-btn"
            onClick={() => onAnswer(question.id, true)}
          >
            Ya
          </button>
          <button 
            className="option-btn"
            onClick={() => onAnswer(question.id, false)}
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
