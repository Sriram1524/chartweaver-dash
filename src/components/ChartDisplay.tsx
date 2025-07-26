import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3 } from 'lucide-react';
import { ChartConfig } from './ChartSelector';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDisplayProps {
  data: any[];
  config: ChartConfig;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ data, config }) => {
  const processData = () => {
    if (config.type === 'pie') {
      // For pie charts, aggregate data by x-axis values
      const aggregated: { [key: string]: number } = {};
      data.forEach(row => {
        const key = String(row[config.xAxis]);
        const value = Number(row[config.yAxis]) || 0;
        aggregated[key] = (aggregated[key] || 0) + value;
      });

      return {
        labels: Object.keys(aggregated),
        datasets: [{
          label: config.yAxis,
          data: Object.values(aggregated),
          backgroundColor: [
            'hsl(var(--chart-1))',
            'hsl(var(--chart-2))',
            'hsl(var(--chart-3))',
            'hsl(var(--chart-4))',
            'hsl(var(--chart-5))',
          ],
          borderWidth: 0,
        }]
      };
    }

    if (config.type === 'scatter') {
      return {
        datasets: [{
          label: `${config.yAxis} vs ${config.xAxis}`,
          data: data.map(row => ({
            x: Number(row[config.xAxis]) || 0,
            y: Number(row[config.yAxis]) || 0,
          })),
          backgroundColor: 'hsl(var(--chart-1))',
          borderColor: 'hsl(var(--chart-1))',
        }]
      };
    }

    // For bar and line charts
    const labels = data.map(row => String(row[config.xAxis]));
    const values = data.map(row => Number(row[config.yAxis]) || 0);

    return {
      labels,
      datasets: [{
        label: config.yAxis,
        data: values,
        backgroundColor: config.type === 'line' ? 'transparent' : 'hsl(var(--chart-1) / 0.8)',
        borderColor: 'hsl(var(--chart-1))',
        borderWidth: 2,
        fill: config.type === 'line',
        tension: config.type === 'line' ? 0.4 : undefined,
      }]
    };
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: config.title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: config.type === 'pie' ? undefined : {
      x: {
        title: {
          display: true,
          text: config.xAxis,
        },
      },
      y: {
        title: {
          display: true,
          text: config.yAxis,
        },
      },
    },
  };

  const downloadChart = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${config.title.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const renderChart = () => {
    const chartData = processData();
    
    switch (config.type) {
      case 'bar':
        return <Bar data={chartData as any} options={chartOptions} />;
      case 'line':
        return <Line data={chartData as any} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData as any} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={chartData as any} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Chart Visualization
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadChart}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PNG
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};