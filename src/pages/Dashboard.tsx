import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { ChartSelector, ChartConfig } from '@/components/ChartSelector';
import { ChartDisplay } from '@/components/ChartDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Upload, FileText, TrendingUp } from 'lucide-react';

interface UploadedFile {
  data: any[];
  fileName: string;
  uploadedAt: Date;
}

interface GeneratedChart extends ChartConfig {
  id: string;
  data: any[];
  createdAt: Date;
}

const Dashboard = () => {
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);
  const [currentChart, setCurrentChart] = useState<GeneratedChart | null>(null);
  const [chartHistory, setChartHistory] = useState<GeneratedChart[]>([]);

  const handleFileProcessed = (data: any[], fileName: string) => {
    setCurrentFile({
      data,
      fileName,
      uploadedAt: new Date()
    });
    setCurrentChart(null);
  };

  const handleGenerateChart = (config: ChartConfig) => {
    if (!currentFile) return;

    const newChart: GeneratedChart = {
      ...config,
      id: Math.random().toString(36).substr(2, 9),
      data: currentFile.data,
      createdAt: new Date()
    };

    setCurrentChart(newChart);
    setChartHistory(prev => [newChart, ...prev]);
  };

  const loadChart = (chart: GeneratedChart) => {
    setCurrentChart(chart);
  };

  const stats = [
    {
      title: "Files Uploaded",
      value: currentFile ? "1" : "0",
      icon: FileText,
      description: "Excel files processed"
    },
    {
      title: "Charts Generated", 
      value: chartHistory.length.toString(),
      icon: BarChart3,
      description: "Visualizations created"
    },
    {
      title: "Data Points",
      value: currentFile ? currentFile.data.length.toString() : "0",
      icon: TrendingUp,
      description: "Rows of data analyzed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Excel Analytics Pro
                </h1>
                <p className="text-sm text-muted-foreground">
                  Transform your data into beautiful visualizations
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* File Upload */}
            <section>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Upload Excel File</h2>
                <p className="text-muted-foreground">
                  Start by uploading your Excel file to begin data analysis
                </p>
              </div>
              <FileUpload onFileProcessed={handleFileProcessed} />
            </section>

            {/* Data Preview */}
            {currentFile && (
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Data Preview</h2>
                  <p className="text-muted-foreground">
                    Review your data and select columns for visualization
                  </p>
                </div>
                <DataPreview 
                  data={currentFile.data} 
                  fileName={currentFile.fileName}
                />
              </section>
            )}

            {/* Current Chart */}
            {currentChart && (
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Generated Chart</h2>
                  <p className="text-muted-foreground">
                    Your data visualization is ready
                  </p>
                </div>
                <ChartDisplay 
                  data={currentChart.data} 
                  config={currentChart}
                />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Chart Generator */}
            {currentFile && (
              <section>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Create Chart</h2>
                  <p className="text-muted-foreground">
                    Configure your visualization settings
                  </p>
                </div>
                <ChartSelector 
                  data={currentFile.data}
                  onGenerateChart={handleGenerateChart}
                />
              </section>
            )}

            {/* Chart History */}
            {chartHistory.length > 0 && (
              <section>
                <Card className="bg-gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle>Chart History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {chartHistory.slice(0, 5).map((chart) => (
                      <div 
                        key={chart.id}
                        className="p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
                        onClick={() => loadChart(chart)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm truncate">
                            {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {chart.yAxis} by {chart.xAxis}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {chart.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Getting Started */}
            {!currentFile && (
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Upload Excel File</p>
                        <p className="text-xs text-muted-foreground">
                          Drag & drop or browse for .xlsx/.xls files
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Preview Data</p>
                        <p className="text-xs text-muted-foreground">
                          Review your data structure and columns
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Generate Charts</p>
                        <p className="text-xs text-muted-foreground">
                          Create beautiful visualizations instantly
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;