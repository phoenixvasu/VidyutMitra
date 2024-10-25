"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define interfaces
interface ConsumptionData {
  time: string;
  consumption: number;
  cost: number;
}

interface EnergyUsageAnalyticsProps {
  energyData: ConsumptionData[]; // Accept energyData as a prop
}

const EnergyUsageAnalytics: React.FC<EnergyUsageAnalyticsProps> = ({ energyData }) => {
  // If energyData is not available, you can handle it with dummy data or a loading state
  const loading = !energyData.length; // Adjust loading logic if necessary

  // Prepare data for chart
  const chartData = {
    labels: energyData.map((data) => data.time),
    datasets: [
      {
        label: "Consumption (kWh)",
        data: energyData.map((data) => data.consumption),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        label: "Cost (₹)",
        data: energyData.map((data) => data.cost),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Energy Consumption and Cost Analysis",
      },
    },
    scales: {
      y: {
        title: { display: true, text: "Consumption (kWh)" },
        position: "left" as const,
        beginAtZero: true,
      },
      y1: {
        title: { display: true, text: "Cost (₹)" },
        position: "right" as const,
        beginAtZero: true,
        grid: { drawOnChartArea: false }, // separate y-axis grid
      },
    },
  };

  // Loading state
  if (loading) return <div>Loading energy analytics data...</div>;

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Energy Usage Analytics</h2>
      <p>Displays energy consumption patterns, cost analysis, and potential savings.</p>
      <Line data={chartData} options={options} />
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">Time</th>
            <th className="border-b p-2">Consumption (kWh)</th>
            <th className="border-b p-2">Cost (₹)</th>
          </tr>
        </thead>
        <tbody>
          {energyData.map((data) => (
            <tr key={data.time} className="border-b">
              <td className="p-2">{data.time}</td>
              <td className="p-2">{data.consumption}</td>
              <td className="p-2">{data.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EnergyUsageAnalytics;
