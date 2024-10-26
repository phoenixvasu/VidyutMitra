// ForecastingRecommendations.tsx
import React, { useEffect, useState } from 'react';

interface ForecastData {
  date: string; // e.g., "2024-10-26"
  expectedUsage: number; // kWh
  recommendation: string; // Recommendation message
}

// Simulated machine learning model function
const simulateMLForecast = (days: number): ForecastData[] => {
  const forecasts: ForecastData[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);

    // Generate dummy expected usage values (random values for demonstration)
    const expectedUsage = Math.random() * 20 + 5; // Random usage between 5 and 25 kWh
    const recommendation =
      expectedUsage > 15
        ? "Consider reducing usage during peak hours."
        : "Good day for energy-efficient practices.";

    forecasts.push({
      date: forecastDate.toISOString().split('T')[0],
      expectedUsage: expectedUsage,
      recommendation,
    });
  }

  return forecasts;
};

const ForecastingRecommendations: React.FC = () => {
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from an API or ML model
    const fetchedForecasts = simulateMLForecast(7); // Generate a week's forecast
    setForecasts(fetchedForecasts);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading forecast data...</div>;
  }

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Forecasting and Recommendations</h2>
      <p>Provides machine learning-based forecasts and personalized recommendations.</p>
      <h3 className="text-lg font-semibold mt-4">Daily Energy Usage Forecast</h3>
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">Date</th>
            <th className="border-b p-2">Expected Usage (kWh)</th>
            <th className="border-b p-2">Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map((forecast, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{forecast.date}</td>
              <td className="p-2">{forecast.expectedUsage.toFixed(2)}</td>
              <td className="p-2">{forecast.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ForecastingRecommendations;
