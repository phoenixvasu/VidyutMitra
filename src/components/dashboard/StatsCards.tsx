// StatsCards.tsx
import React from 'react';
import { UserData } from '@/types/user'; // Adjust the import path for UserData

interface StatsCardsProps {
  totalSolarPower: number; // kWh
  uniqueDays: number; // Number of unique days
  userData: UserData; // User data type
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalSolarPower,
  uniqueDays,
  userData,
}) => {
  return (
    <section className="flex flex-wrap gap-4 mt-6">
      <div className="w-full sm:w-1/3 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Solar Power Produced</h3>
        <p className="text-2xl font-bold mt-2">{totalSolarPower} kWh</p>
      </div>
      <div className="w-full sm:w-1/3 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold">Unique Days of Data</h3>
        <p className="text-2xl font-bold mt-2">{uniqueDays} days</p>
      </div>
      <div className="w-full sm:w-1/3 p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold">User: {userData.name}</h3>
        <p className="text-2xl font-bold mt-2">Welcome back!</p>
      </div>
    </section>
  );
};

export default StatsCards;
