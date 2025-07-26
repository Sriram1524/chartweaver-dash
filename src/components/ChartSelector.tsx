import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, LineChart, PieChart, ScatterChart, Download } from 'lucide-react';

interface ChartSelectorProps {
  data: any[];
  onGenerateChart: (config: ChartConfig) => void;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  xAxis: string;
  yAxis: string;
  title: string;
}

export const ChartSelector: React.FC<ChartSelectorProps> = ({ data, onGenerateChart }) => {
  const [chartType, setChartType] = useState<ChartConfig['type']>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');

  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter(col => 
    typeof data[0][col] === 'number' || !isNaN(Number(data[0][col]))
  );
  
  const chartTypes = [
    { type: 'bar' as const, label: 'Bar Chart', icon: BarChart3 },
    { type: 'line' as const, label: 'Line Chart', icon: LineChart },
    { type: 'pie' as const, label: 'Pie Chart', icon: PieChart },
    { type: 'scatter' as const, label: 'Scatter Plot', icon: ScatterChart },
  ];

  const handleGenerateChart = () => {
    if (!xAxis || !yAxis) return;
    
    onGenerateChart({
      type: chartType,
      xAxis,
      yAxis,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart: ${yAxis} by ${xAxis}`
    });
  };

  const canGenerate = xAxis && yAxis;

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle>Create Chart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Chart Type</label>
          <div className="grid grid-cols-2 gap-2">
            {chartTypes.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant={chartType === type ? "default" : "outline"}
                onClick={() => setChartType(type)}
                className="h-auto p-3 flex flex-col gap-2"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Axis Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">X-Axis</label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Y-Axis</label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Numeric
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateChart}
          disabled={!canGenerate}
          className="w-full bg-gradient-primary hover:shadow-elegant transition-all duration-200"
          size="lg"
        >
          Generate Chart
        </Button>
      </CardContent>
    </Card>
  );
};