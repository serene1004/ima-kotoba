import {
  ArcElement,
  Chart as ChartJS,
  Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

type EmotionStat = {
  icon: string;
  label: string;
  count: number;
};

type EmotionChartProps = {
  stats: EmotionStat[];
  total: number;
};

const chartColors = ['#716ba3', '#9a94bf', '#beb8d7', '#d9b6ba', '#c69099', '#a96f79'];

ChartJS.register(ArcElement, Tooltip);

function EmotionChart({ stats, total }: EmotionChartProps) {
  if (total === 0) {
    return (
      <p className="emotion-empty">
        이번 주의 첫 마음을 남겨보세요.
      </p>
    );
  }

  return (
    <div className="emotion-chart-content">
      <div className="emotion-chart">
        <Doughnut
          aria-label={`이번 주 감정 기록 ${total}개`}
          data={{
            labels: stats.map((stat) => stat.label),
            datasets: [
              {
                data: stats.map((stat) => stat.count),
                backgroundColor: chartColors.slice(0, stats.length),
                borderColor: '#f3f0fb',
                borderWidth: 3,
                hoverOffset: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            animation: { duration: 360 },
            plugins: {
              legend: { display: false },
              tooltip: {
                displayColors: false,
                backgroundColor: '#3d3946',
                callbacks: {
                  label: (context) => `${context.label}: ${context.parsed}개`,
                },
              },
            },
          }}
        />
        <strong>{total}</strong>
      </div>
      <ul className="emotion-legend" aria-label="감정별 기록 수">
        {stats.slice(0, 3).map((stat, index) => (
          <li key={stat.label}>
            <span
              className="emotion-dot"
              style={{ backgroundColor: chartColors[index] }}
            />
            <span>
              {stat.icon} {stat.label}
            </span>
            <strong>{stat.count}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmotionChart;
