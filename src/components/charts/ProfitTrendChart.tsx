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
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ProfitTrendData } from '../../types/manpower';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProfitTrendChartProps {
  data: ProfitTrendData[];
  isArabic?: boolean;
}

export const ProfitTrendChart: React.FC<ProfitTrendChartProps> = ({ data, isArabic = false }) => {
  const chartData = {
    labels: data.map(item => item.week),
    datasets: [
      {
        label: isArabic ? 'الإيرادات' : 'Revenue',
        data: data.map(item => item.revenue),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'rgb(34, 197, 94)',
        pointHoverBackgroundColor: 'rgb(34, 197, 94)',
        pointHoverBorderColor: 'rgb(34, 197, 94)',
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: isArabic ? 'التكاليف' : 'Costs',
        data: data.map(item => item.costs),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'rgb(239, 68, 68)',
        pointHoverBackgroundColor: 'rgb(239, 68, 68)',
        pointHoverBorderColor: 'rgb(239, 68, 68)',
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: isArabic ? 'الأرباح' : 'Profit',
        data: data.map(item => item.profit),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'rgb(59, 130, 246)',
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        pointRadius: 6,
        pointHoverRadius: 8
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
        text: isArabic ? 'اتجاه الأرباح (5 أسابيع)' : '5-Week Profit Trend Analysis',
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
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          title: function(context: any) {
            return `${context[0].label}`;
          },
          label: function(context: any) {
            const value = new Intl.NumberFormat('en-SA', {
              style: 'currency',
              currency: 'SAR',
              notation: 'compact'
            }).format(context.parsed.y);
            return `${context.dataset.label}: ${value}`;
          },
          afterBody: function(context: any) {
            const dataPoint = data[context[0].dataIndex];
            return [
              '',
              `${isArabic ? 'المشاريع:' : 'Projects:'} ${dataPoint.projects}`,
              `${isArabic ? 'الموظفون:' : 'Employees:'} ${dataPoint.employees}`,
              `${isArabic ? 'هامش الربح:' : 'Profit Margin:'} ${dataPoint.margin.toFixed(1)}%`
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
          text: isArabic ? 'الأسبوع' : 'Week',
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
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: isArabic ? 'المبلغ (ريال سعودي)' : 'Amount (SAR)',
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
          },
          callback: function(value: any) {
            return new Intl.NumberFormat('en-SA', {
              style: 'currency',
              currency: 'SAR',
              notation: 'compact',
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      line: {
        borderWidth: 3
      },
      point: {
        hoverBorderWidth: 3
      }
    }
  };

  return (
    <div className="h-80 bg-white rounded-lg p-4">
      <Line data={chartData} options={options} />
    </div>
  );
};