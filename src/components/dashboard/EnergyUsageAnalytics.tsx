// EnergyUsageAnalytics.tsx

"use client";
import { useEffect, useState } from "react";
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
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firebase imports
import firebaseApp from "./firebaseConfig"; // Firebase app config import

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

const EnergyUsageAnalytics = () => {
  const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Dummy data
  const dummyData: ConsumptionData[] = [
    { time: "00:00", consumption: 2.1, cost: 0.5 },
    { time: "01:00", consumption: 1.8, cost: 0.4 },
    { time: "02:00", consumption: 1.5, cost: 0.35 },
    // Additional entries ...
    { time: "23:00", consumption: 2.5, cost: 0.6 },
  ];

  // Fetch data from Firebase Firestore
  const fetchConsumptionData = async () => {
    try {
      const db = getFirestore(firebaseApp);
      const querySnapshot = await getDocs(collection(db, "consumptionData"));
      const firebaseData: ConsumptionData[] = [];
      querySnapshot.forEach((doc) => {
        firebaseData.push(doc.data() as ConsumptionData);
      });
      setConsumptionData(firebaseData.length ? firebaseData : dummyData);
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      setConsumptionData(dummyData); // Use dummy data in case of error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumptionData();
  }, []);

  if (loading) return <div>Loading energy analytics data...</div>;

  // Prepare data for chart
  const chartData = {
    labels: consumptionData.map((data) => data.time),
    datasets: [
      {
        label: "Consumption (kWh)",
        data: consumptionData.map((data) => data.consumption),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        label: "Cost (₹)",
        data: consumptionData.map((data) => data.cost),
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
          {consumptionData.map((data) => (
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
