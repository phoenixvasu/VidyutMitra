"use client";
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

import { Line } from "react-chartjs-2";

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

import { useEffect, useState } from "react";

// Import the tariff data JSON file
import tariffData from '../../data/dummytariffData.json'; // Adjust the path as needed

interface TariffData {
  time: string;
  rate: number;
}

const TariffMonitor = () => {
  const [tariffs, setTariffs] = useState<TariffData[]>([]);

  useEffect(() => {
    // Load tariff data directly from JSON file
    setTariffs(tariffData);
  }, []);

  // Prepare chart data
  const chartData = {
    labels: tariffs.map((tariff) => tariff.time),
    datasets: [
      {
        label: "Tariff Rate (₹/kWh)",
        data: tariffs.map((tariff) => tariff.rate),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4, // smooth the line
        fill: true, // fill area under the line
      },
    ],
  };

  // Define chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Tariff Rates by Hour`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          maxRotation: 0, // horizontal labels for time
        },
      },
      y: {
        title: {
          display: true,
          text: "Rate (₹/kWh)",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-bold mb-4">Tariff Monitor</h3>
      <Line data={chartData} options={options} />
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">Time</th>
            <th className="border-b p-2">Rate (₹/kWh)</th>
          </tr>
        </thead>
        <tbody>
          {tariffs.map((tariff) => (
            <tr key={tariff.time} className="border-b">
              <td className="p-2">{tariff.time}</td>
              <td className="p-2">{tariff.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TariffMonitor;
