// CostBenefitAnalysis.tsx
import React, { useEffect, useState } from 'react';
import firebaseApp from './firebaseConfig'; // Adjust import if needed
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface UsageData {
  timePeriod: string; // e.g., "Peak", "Off-Peak"
  usage: number; // kWh
  cost: number; // ₹ for that period
  suggestion?: string; // Suggested action to reduce costs
}

const CostBenefitAnalysis: React.FC = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(0);

  // Initialize Firestore
  const db = getFirestore(firebaseApp);

  // Extended dummy data for usage, cost, and savings calculations
  const dummyUsageData: UsageData[] = [
    { timePeriod: "Peak (6pm - 9pm)", usage: 6.0, cost: 600, suggestion: "Shift some usage to Off-Peak" },
    { timePeriod: "Off-Peak (9pm - 6am)", usage: 8.5, cost: 130, suggestion: "Utilize more during Off-Peak for savings" },
    { timePeriod: "Daytime (9am - 6pm)", usage: 12.0, cost: 700, suggestion: "Consider solar or energy-efficient appliances" },
    { timePeriod: "Early Morning (6am - 9am)", usage: 4.0, cost: 180, suggestion: "Reduce usage or shift to Off-Peak" },
    { timePeriod: "Weekend (Sat-Sun, all day)", usage: 10.0, cost: 250, suggestion: "Plan heavy usage during weekends" },
  ];

  // Fetch usage data from Firestore
  const fetchUsageData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'usageData')); // Adjust the collection name as needed
      const data: UsageData[] = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          timePeriod: docData.timePeriod,
          usage: docData.usage,
          cost: docData.cost,
          suggestion: docData.suggestion,
        } as UsageData;
      });

      // Use Firebase data if available, otherwise use dummy data
      setUsageData(data.length > 0 ? data : dummyUsageData);
    } catch (error) {
      console.error('Error fetching usage data from Firebase:', error);
      setUsageData(dummyUsageData); // Use dummy data if Firebase fetch fails
    }
  };

  // Calculate total cost and potential savings
  const calculateSummary = () => {
    const total = usageData.reduce((acc, item) => acc + item.cost, 0);
    setTotalCost(total);

    // Assume 30% savings for peak usage shifts
    const savings = usageData.reduce((acc, item) => {
      if (item.timePeriod.includes("Peak")) return acc + item.cost * 0.3;
      return acc;
    }, 0);
    setPotentialSavings(savings);
  };

  // Fetch data and calculate summary on mount
  useEffect(() => {
    fetchUsageData();
  }, []);

  // Recalculate summary whenever usageData updates
  useEffect(() => {
    if (usageData.length > 0) {
      calculateSummary();
    }
  }, [usageData]);

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Cost-Benefit Analysis</h2>
      <p>Maximizes savings with energy shift suggestions and usage data insights.</p>

      <h3 className="text-lg font-semibold mt-4">Usage and Cost Analysis</h3>
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">Time Period</th>
            <th className="border-b p-2">Usage (kWh)</th>
            <th className="border-b p-2">Cost (₹)</th>
            <th className="border-b p-2">Suggestion</th>
          </tr>
        </thead>
        <tbody>
          {usageData.map((data, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{data.timePeriod}</td>
              <td className="p-2">{data.usage.toFixed(2)}</td>
              <td className="p-2">₹{data.cost.toFixed(2)}</td>
              <td className="p-2">{data.suggestion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Summary</h3>
        <p>Total Cost: ₹{totalCost.toFixed(2)}</p>
        <p>Potential Savings by Shifting Usage: ₹{potentialSavings.toFixed(2)}</p>
      </div>
    </section>
  );
};

export default CostBenefitAnalysis;
