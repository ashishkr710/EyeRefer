import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

interface ChartsSectionProps {
  lineChartData: any;
  barChartData: any;
  pieChartData: any;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ lineChartData, barChartData, pieChartData }) => {
  return (
    <div className="charts-section">
      <h6 className="charts-title fw-bold" style={{ fontSize: 16, color: "black" }}>Patient Data Charts</h6>
      <div className="charts-container">
      <div className="chart" style={{ width: '800px', height: '600px' }}>
        <h6>Line Chart</h6>
        <Line data={lineChartData} />
      </div>
      <div className="chart" style={{ width: '800px', height: '600px' }}>
        <h6>Bar Chart</h6>
        <Bar data={barChartData} />
      </div>
      <div className="chart" style={{ width: '800px', height: '600px' }}>
        <h6>Pie Chart</h6>
        <Pie data={pieChartData} />
      </div>
      </div>
    </div>
  );
};

export default ChartsSection;