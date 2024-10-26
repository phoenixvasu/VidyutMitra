// StatsCards.tsx
import React, { useEffect, useState } from 'react';
import firebaseApp from './firebaseConfig'; // Adjust import path if needed
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface Stats {
  totalEnergyProduced: number; // kWh
  totalEnergyConsumed: number; // kWh
  totalSavings: number; // ₹
}

const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalEnergyProduced: 0,
    totalEnergyConsumed: 0,
    totalSavings: 0,
  });

  const db = getFirestore(firebaseApp);

  // Dummy data for stats
  const dummyStats: Stats = {
    totalEnergyProduced: 3200, // in kWh
    totalEnergyConsumed: 2800, // in kWh
    totalSavings: 14500, // in ₹
  };

  // Fetch stats data from Firebase
  const fetchStatsData = async () => {
    try {
      const statsSnapshot = await getDocs(collection(db, 'energyStats')); // Adjust collection name as needed
      const data = statsSnapshot.docs.map((doc) => doc.data());

      // Calculate total stats from Firebase data or use dummy data
      if (data.length > 0) {
        const firebaseStats: Stats = data.reduce(
          (acc, item) => ({
            totalEnergyProduced: acc.totalEnergyProduced + item.energyProduced,
            totalEnergyConsumed: acc.totalEnergyConsumed + item.energyConsumed,
            totalSavings: acc.totalSavings + item.savings,
          }),
          { totalEnergyProduced: 0, totalEnergyConsumed: 0, totalSavings: 0 }
        ) as Stats;
        setStats(firebaseStats);
      } else {
        setStats(dummyStats);
      }
    } catch (error) {
      console.error('Error fetching stats data from Firebase:', error);
      setStats(dummyStats); // Use dummy data if Firebase fetch fails
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);

  return (
    <section className="flex flex-wrap gap-4 mt-6">
      <div className="w-full sm:w-1/3 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Energy Produced</h3>
        <p className="text-2xl font-bold mt-2">{stats.totalEnergyProduced} kWh</p>
      </div>
      <div className="w-full sm:w-1/3 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Energy Consumed</h3>
        <p className="text-2xl font-bold mt-2">{stats.totalEnergyConsumed} kWh</p>
      </div>
      <div className="w-full sm:w-1/3 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Savings</h3>
        <p className="text-2xl font-bold mt-2">₹{stats.totalSavings}</p>
      </div>
    </section>
  );
};

export default StatsCards;
