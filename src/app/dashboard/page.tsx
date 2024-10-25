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
import ForecastingRecommendations from "@/components/dashboard/ForecastingRecommendations";
import CostBenefitAnalysis from "@/components/dashboard/CostBenefitAnalysis";
import UserNotifications from "@/components/dashboard/UserNotifications";
import StatsCards from "@/components/dashboard/StatsCards";
import { useAuthContext } from "@/context/auth-context";
import { fetchDISCOMData, fetchTOUHistory, fetchWeatherData } from "@/lib/api";
import { db } from "@/lib/firebase";
import { Discom, EnergyData, TOUData, UserData } from "@/types/user";
import { doc, getDoc } from "firebase/firestore";
import { parse } from "papaparse";
import { toast } from "sonner";

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
const transformedEnergyData = energyData.map((data) => ({
  time: data.time,            // Ensure these properties match
  consumption: data.consumption, // Ensure these properties match
  cost: data.cost             // Ensure these properties match
}));
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
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {userData.name || "User"}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>Manage your energy consumption.</CardDescription>
        </CardHeader>
        <CardContent>
          <StatsCards
            totalSolarPower={totalSolarPower}
            uniqueDays={uniqueDays}
            userData={userData}
          />
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          {fileName && <p>File Uploaded: {fileName}</p>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TariffMonitor />
        <EnergyUsageAnalytics energyData={transformedEnergyData} />
        <SmartScheduling />
        <SolarEnergyManagement />
        <ForecastingRecommendations />
        <CostBenefitAnalysis />
        <UserNotifications />
      </div>
    </div>
  );
}
