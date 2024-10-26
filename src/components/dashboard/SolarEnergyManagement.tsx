// SolarEnergyManagement.tsx
import React, { useEffect, useState } from 'react';
import firebaseApp from './firebaseConfig'; // Adjust the import based on your file structure
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface SolarData {
  time: string; // e.g., "2024-10-25T14:00:00Z"
  solarOutput: number; // kW
  batteryLevel: number; // %
}

const SolarEnergyManagement: React.FC = () => {
  const [solarData, setSolarData] = useState<SolarData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize Firestore
  const db = getFirestore(firebaseApp);

  // Dummy data
  const dummyData: SolarData[] = [
    { time: "2024-10-25T08:00:00Z", solarOutput: 1.5, batteryLevel: 80 },
    { time: "2024-10-25T09:00:00Z", solarOutput: 2.0, batteryLevel: 75 },
    { time: "2024-10-25T10:00:00Z", solarOutput: 2.5, batteryLevel: 70 },
    { time: "2024-10-25T11:00:00Z", solarOutput: 3.0, batteryLevel: 65 },
    { time: "2024-10-25T12:00:00Z", solarOutput: 4.0, batteryLevel: 60 },
    { time: "2024-10-25T13:00:00Z", solarOutput: 3.5, batteryLevel: 62 },
    { time: "2024-10-25T14:00:00Z", solarOutput: 4.2, batteryLevel: 55 },
  ];

  // Fetch solar data from Firestore
  const fetchSolarData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'solarData')); // Adjust the collection name as needed
      const data: SolarData[] = querySnapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          time: docData.time,
          solarOutput: docData.solarOutput,
          batteryLevel: docData.batteryLevel
        } as SolarData;
      });
      setSolarData(data);
    } catch (error) {
      console.error("Error fetching solar data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolarData();
  }, []);

  useEffect(() => {
    // Fallback to dummy data if Firestore is empty or if user data is not provided
    if (solarData.length === 0 && !loading) {
      setSolarData(dummyData);
    }
  }, [loading, solarData]);

  if (loading) {
    return <div>Loading solar energy data...</div>;
  }

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Solar Energy Management</h2>
      <p>Tracks solar panel output, battery storage, and energy self-sufficiency.</p>
      <h3 className="text-lg font-semibold mt-4">Solar Output and Battery Levels</h3>
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">Time</th>
            <th className="border-b p-2">Solar Output (kW)</th>
            <th className="border-b p-2">Battery Level (%)</th>
          </tr>
        </thead>
        <tbody>
          {solarData.map((data, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{new Date(data.time).toLocaleString()}</td>
              <td className="p-2">{data.solarOutput.toFixed(2)}</td>
              <td className="p-2">{data.batteryLevel.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default SolarEnergyManagement;
