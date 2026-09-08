import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const ResultChart = ({ tScores }) => {
  // Define scales order
  const scaleLabels = ['L', 'F', 'K', '1-Hs', '2-D', '3-Hy', '4-Pd', '5-Mf', '6-Pa', '7-Pt', '8-Sc', '9-Ma', '0-Si'];
  
  // Extract scores in order
  const dataPoints = scaleLabels.map(label => tScores[label] || 50); // default to 50 if missing

  const data = {
    labels: scaleLabels,
    datasets: [
      {
        label: 'T-Score Profile',
        data: dataPoints,
        borderColor: 'var(--primary-color)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        pointBackgroundColor: dataPoints.map(val => val > 65 ? 'var(--danger-color)' : 'var(--primary-color)'),
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 2,
        tension: 0.1, // slightly curved line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'MMPI Profile (T-Scores)',
        font: {
          family: 'Inter',
          size: 16
        }
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 65,
            yMax: 65,
            borderColor: 'var(--danger-color)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: 'T=65 (Batas Klinis)',
              display: true,
              position: 'end',
              backgroundColor: 'var(--danger-color)'
            }
          },
          line2: {
            type: 'line',
            yMin: 50,
            yMax: 50,
            borderColor: 'var(--text-muted)',
            borderWidth: 1,
            borderDash: [2, 2],
          }
        }
      }
    },
    scales: {
      y: {
        min: 20,
        max: 120,
        ticks: {
          stepSize: 10
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default ResultChart;
