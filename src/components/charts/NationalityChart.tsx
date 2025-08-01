import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { NationalityData } from '../../types/manpower';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface NationalityChartProps {
  data: NationalityData[];
  isArabic?: boolean;
}

export const NationalityChart: React.FC<NationalityChartProps> = ({ data, isArabic = false }) => {
  const colors = [
    'rgba(34, 197, 94, 0.8)',   // Green
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(249, 115, 22, 0.8)',  // Orange
    'rgba(168, 85, 247, 0.8)',  // Purple
    'rgba(236, 72, 153, 0.8)',  // Pink
    'rgba(14, 165, 233, 0.8)',  // Sky
    'rgba(132, 204, 22, 0.8)',  // Lime
    'rgba(245, 158, 11, 0.8)',  // Amber
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(107, 114, 128, 0.8)'  // Gray
  ];

  const borderColors = colors.map(color => color.replace('0.8', '1'));

  const chartData = {
    labels: data.map(item => item.nationality),
    datasets: [
      {
        label: isArabic ? 'عدد الموظفين' : 'Employee Count',
        data: data.map(item => item.count),
        backgroundColor: colors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          },
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
              return data.labels.map((label: string, i: number) => {
                const dataset = data.datasets[0];
                const count = dataset.data[i];
                const percentage = ((count / total) * 100).toFixed(1);
                return {
                  text: `${label} (${count} - ${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'circle'
                };
              });
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: isArabic ? 'توزيع الجنسيات في القوى العاملة' : 'Workforce Nationality Distribution',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#1f2937',
        padding: {
          top: 10,
          bottom: 20
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
            return context[0].label;
          },
          label: function(context: any) {
            const item = data[context.dataIndex];
            const total = data.reduce((sum, d) => sum + d.count, 0);
            const percentage = ((item.count / total) * 100).toFixed(1);
            return `${isArabic ? 'الموظفون:' : 'Employees:'} ${item.count} (${percentage}%)`;
          },
          afterLabel: function(context: any) {
            const item = data[context.dataIndex];
            return [
              `${isArabic ? 'متوسط الأجر:' : 'Average Rate:'} ${new Intl.NumberFormat('en-SA', { 
                style: 'currency', 
                currency: 'SAR' 
              }).format(item.averageRate)}`,
              `${isArabic ? 'إجمالي الساعات:' : 'Total Hours:'} ${item.totalHours.toLocaleString()}`
            ];
          }
        }
      }
    },
    cutout: '50%',
    elements: {
      arc: {
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    }
  };

  return (
    <div className="h-80 bg-white rounded-lg p-4">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};