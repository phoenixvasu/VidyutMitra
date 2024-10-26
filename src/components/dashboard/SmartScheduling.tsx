"use client";
import { useEffect, useState } from "react";
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
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "./firebaseConfig"; // Your Firebase config

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ApplianceData {
  appliance: string;
  duration: number; // hours of use
  priority: "high" | "medium" | "low";
}

interface TariffData {
  time: string;
  rate: number;
}

const SmartScheduling = () => {
  const [appliances, setAppliances] = useState<ApplianceData[]>([
    { appliance: "Washing Machine", duration: 2, priority: "high" },
    { appliance: "Dishwasher", duration: 1, priority: "medium" },
    { appliance: "Electric Vehicle Charger", duration: 4, priority: "high" },
  ]);

  const [tariffs, setTariffs] = useState<TariffData[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(firebaseApp);

  // Dummy data for tariffs if Firebase data isn't available
  const dummyTariffs = [
    { time: "00:00", rate: 3.5 },
    { time: "08:00", rate: 5.0 },
    { time: "16:00", rate: 2.0 },
    { time: "20:00", rate: 4.5 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tariffsCollection = collection(db, "tariffs");
        const tariffSnapshot = await getDocs(tariffsCollection);
        if (!tariffSnapshot.empty) {
          setTariffs(tariffSnapshot.docs.map(doc => doc.data() as TariffData));
        } else {
          setTariffs(dummyTariffs);
        }
      } catch (error) {
        console.error("Error fetching tariff data:", error);
        setTariffs(dummyTariffs);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const peakThreshold = 4.0;

  // Generate scheduling recommendations
  const scheduleRecommendations = appliances.map((appliance) => {
    const optimalTimes = tariffs
      .filter((tariff) => tariff.rate <= peakThreshold)
      .map((tariff) => tariff.time);
    return {
      appliance: appliance.appliance,
      recommendedTimes: optimalTimes,
      duration: appliance.duration,
      priority: appliance.priority,
    };
  });

  // Chart data for visualization
  const chartData = {
    labels: tariffs.map((tariff) => tariff.time),
    datasets: [
      {
        label: "Tariff Rate (₹/kWh)",
        data: tariffs.map((tariff) => tariff.rate),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Rate (₹/kWh)" } },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Smart Scheduling</h2>
      <p>Auto-schedules high-energy appliances based on user preferences and tariff forecasts.</p>
      <Line data={chartData} options={chartOptions} />

      <h3 className="mt-6 font-bold text-lg">Recommended Appliance Schedule</h3>
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">Appliance</th>
            <th className="border-b p-2">Recommended Times</th>
            <th className="border-b p-2">Duration (hrs)</th>
          </tr>
        </thead>
        <tbody>
          {scheduleRecommendations.map((recommendation) => (
            <tr key={recommendation.appliance} className="border-b">
              <td className="p-2">{recommendation.appliance}</td>
              <td className="p-2">{recommendation.recommendedTimes.join(", ")}</td>
              <td className="p-2">{recommendation.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SmartScheduling;
