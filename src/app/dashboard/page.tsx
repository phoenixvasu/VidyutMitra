"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import TariffMonitor from "@/components/dashboard/TariffMonitor";
 import EnergyUsageAnalytics from "@/components/dashboard/EnergyUsageAnalytics";
import SmartScheduling from "@/components/dashboard/SmartScheduling";
 import SolarEnergyManagement from "@/components/dashboard/SolarEnergyManagement";
// import ForecastingRecommendations from "@/components/dashboard/ForecastingRecommendations";
// import CostBenefitAnalysis from "@/components/dashboard/CostBenefitAnalysis";
// import UserNotifications from "@/components/dashboard/UserNotifications";
import StatsCards from "@/components/dashboard/StatsCards";
import { useAuthContext } from "@/context/auth-context";
import { fetchDISCOMData, fetchTOUHistory, fetchWeatherData } from "@/lib/api";
import { db } from "@/lib/firebase";
import { Discom, EnergyData, TOUData, UserData } from "@/types/user";
import { doc, getDoc } from "firebase/firestore";
import { parse } from "papaparse";
import { toast } from "sonner";
import ForecastingRecommendations from "@/components/dashboard/ForecastingRecommendations";
import CostBenefitAnalysis from "@/components/dashboard/CostBenefitAnalysis";
import UserNotifications from "@/components/dashboard/UserNotifications";
//import SolarEnergyManagement from "@/components/dashboard/SolarEnergyManagement";
//import SmartScheduling from "@/components/dashboard/SmartScheduling";

export default function Dashboard() {
  // State declarations
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [discomInfo, setDiscomInfo] = useState<Discom | null>(null);
  const [touHistory, setTOUHistory] = useState<TOUData[]>([]);

  // Process CSV data
  const processCSV = useCallback((str: string) => {
    parse(str, {
      header: true,
      complete: (results) => {
        const processedData = results.data.map((row: any) => ({
          SendDate: row["SendDate"],
          SolarPower: parseFloat(row["Solar Power (kW)"]),
          SolarEnergy: parseFloat(row["Solar energy Generation  (kWh)"]),
          Consumption: parseFloat(row["consumptionValue (kW)"]),
        }));
        setEnergyData(processedData);
        localStorage.setItem("energyData", JSON.stringify(processedData));
      },
    });
  }, []);

  // File upload handler
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (typeof text === "string") {
            processCSV(text);
          }
        };
        reader.readAsText(file);
      }
    },
    [processCSV]
  );

  // Load stored energy data
  useEffect(() => {
    const storedData = localStorage.getItem("energyData");
    if (storedData) {
      setEnergyData(JSON.parse(storedData));
      setFileName("energyData.csv");
    }
  }, []);

  // Fetch geolocation and weather data
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const { latitude, longitude } = coords;
        const data = await fetchWeatherData(latitude, longitude);
        if (data) {
          setWeatherData(data);
          setLocationName(data.name);
        }
      });
    }
  }, []);

  // Initialize dashboard data
  useEffect(() => {
    const initializeDashboard = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as UserData;
            setUserData(userData);
            const discomData = await fetchDISCOMData(userData.electricityProvider);
            if (discomData) {
              setDiscomInfo(discomData);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeDashboard();
  }, [user]);

  // Fetch TOU history and display latest TOU rate
  useEffect(() => {
    let isMounted = true;
    fetchTOUHistory().then((touHistory) => {
      if (isMounted) {
        const latestTou = touHistory[0];
        toast.success("Latest TOU rate fetched", {
          description: `Current TOU rate: ₹${latestTou.rate} /kWh`,
        });
        setTOUHistory(touHistory);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate metrics for the dashboard components
  const totalSolarPower = energyData.reduce(
    (sum, data) => sum + data.SolarEnergy,
    0
  );
  const uniqueDays = new Set(
    energyData.map((data) =>
      new Date(data.SendDate.split(" ")[0]).toDateString()
    )
  ).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] text-sm text-muted-foreground">
        No user data available.
      </div>
    );
  }



  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Tariff Monitor Component */}
          {/* Tariff Monitor Component */}
       
{/* Tariff Monitor Component */}
<section className="bg-white shadow rounded-lg p-6">
  <h2 className="text-xl font-bold mb-4">Tariff Monitor</h2>
  <p>Real-time and forecasted ToU and ToD tariffs displayed here.</p>
  {/* Add real-time tariff data and forecasted rates */}
  <TariffMonitor discom={discomInfo?.name || ''} /> {/* Pass the DISCOM name */}
</section>

          {/* Energy Usage Analytics Component */}
          <section className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Tariff Monitor</h2>
        {/* Include TariffMonitor component here */}
      </section>

      {/* Energy Usage Analytics Section */}
      <section className="bg-white shadow rounded-lg p-6 mb-8">
        <EnergyUsageAnalytics />
      </section>
          {/* Smart Scheduling Component */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Smart Scheduling</h2>
            <SmartScheduling />
            {/* Interface for scheduling appliance usage */}
          </section>

          {/* Solar Energy Management Component */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Solar Energy Management</h2>
            <SolarEnergyManagement></SolarEnergyManagement>
          </section>

          {/* Forecasting and Recommendations Component */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Forecasting and Recommendations</h2>
            <ForecastingRecommendations></ForecastingRecommendations>
          </section>

          {/* Cost-Benefit Analysis Component */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Cost-Benefit Analysis</h2>
            <CostBenefitAnalysis/>
            {/* Insert cost projections and savings analysis */}
          </section>

          {/* User Notifications and Alerts Component */}
          <section className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">User Notifications and Alerts</h2>
           <UserNotifications />
          </section>
          <section className="p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <StatsCards
        // userData={userData}
        totalSolarPower={totalSolarPower}
        uniqueDays={uniqueDays}
        locationName={locationName}
        weatherData={weatherData}
      />
    </section>
        </div>
      </main>
    </div>
  );
}