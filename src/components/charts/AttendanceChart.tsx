import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AttendancePattern } from '../../types/manpower';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AttendanceChartProps {
  data: AttendancePattern[];
  isArabic?: boolean;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data, isArabic = false }) => {
  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-SA', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets: [
      {
        label: isArabic ? 'الساعات العادية' : 'Regular Hours',
        data: data.map(item => item.totalHours),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: isArabic ? 'العمل الإضافي' : 'Overtime Hours',
        data: data.map(item => item.overtime),
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: true,
        text: isArabic ? 'أنماط الحضور (30 يوم)' : 'Attendance Patterns (30 Days)',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#1f2937',
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          title: function(context: any) {
            const dataPoint = data[context[0].dataIndex];
            const date = new Date(dataPoint.date);
            return date.toLocaleDateString('en-SA', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric' 
            });
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y} ${isArabic ? 'ساعة' : 'hours'}`;
          },
          afterBody: function(context: any) {
            const dataPoint = data[context[0].dataIndex];
            return [
              '',
              `${isArabic ? 'إجمالي الحضور:' : 'Total Attendance:'} ${dataPoint.attendance}`,
              `${isArabic ? 'الكفاءة:' : 'Efficiency:'} ${dataPoint.efficiency.toFixed(1)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: isArabic ? 'التاريخ' : 'Date',
          font: {
            size: 14,
            weight: '600'
          },
          color: '#4b5563'
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          maxRotation: 45
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: isArabic ? 'الساعات' : 'Hours',
          font: {
            size: 14,
            weight: '600'
          },
          color: '#4b5563'
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          }
        },
        beginAtZero: true
      }
    },
    elements: {
      bar: {
        borderWidth: 1
      }
    }
  };

  return (
    <div className="h-80 bg-white rounded-lg p-4">
      <Bar data={chartData} options={options} />
    </div>
  );
};