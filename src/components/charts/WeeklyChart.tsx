import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

type WeeklyDay = { key: string; label: string; count: number };
type WeeklyChartProps = { days: WeeklyDay[]; total: number; todayKey: string };

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function WeeklyChart({ days, total, todayKey }: WeeklyChartProps) {
  return (
    <div className="weekly-chart">
      <Bar
        aria-label={`이번 주 작성한 기록 ${total}개`}
        data={{
          labels: days.map((day) => day.label),
          datasets: [{
            data: days.map((day) => day.count),
            backgroundColor: days.map((day) => (day.key === todayKey ? '#716ba3' : '#b9b3d8')),
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 24,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 360 },
          plugins: {
            legend: { display: false },
            tooltip: {
              displayColors: false,
              backgroundColor: '#3d3946',
              callbacks: { label: (context) => `${context.parsed.y}개 기록` },
            },
          },
          scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: '#8d8792', font: { size: 11 } } },
            y: {
              beginAtZero: true,
              display: false,
              grid: { display: false },
              border: { display: false },
              ticks: { precision: 0 },
            },
          },
        }}
      />
    </div>
  );
}

export default WeeklyChart;
