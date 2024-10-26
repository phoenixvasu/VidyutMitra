// UserNotifications.tsx
import React, { useEffect, useState } from 'react';
import firebaseApp from './firebaseConfig'; // Adjust import path if needed
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface Notification {
  id: number;
  message: string;
  type: 'tariff' | 'weather' | 'solar';
}

const UserNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tariffData, setTariffData] = useState<number>(0); // Assume this is tariff per kWh
  const db = getFirestore(firebaseApp);

  // Fetch tariff data and user settings from Firebase
  const fetchFirebaseData = async () => {
    try {
      const tariffSnapshot = await getDocs(collection(db, 'tariffData')); // Adjust the collection name as needed
      const tariffDocs = tariffSnapshot.docs.map((doc) => doc.data());
      
      // Mock: Set average tariff data from Firebase or dummy fallback
      const tariff = tariffDocs.length > 0 ? tariffDocs[0].tariff : 12.0;
      setTariffData(tariff);
      
      // Initialize notifications based on fetched data
      initializeNotifications(tariff);
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }
  };

  // Initialize notifications based on dummy and Firebase data
  const initializeNotifications = (tariff: number) => {
    const alerts: Notification[] = [];

    // Tariff Alert
    if (tariff > 10.0) { // Mock threshold for high tariff alert
      alerts.push({ id: 1, message: 'High tariff alert! Try shifting energy usage to off-peak times.', type: 'tariff' });
    }

    // Mock API Call for Weather Alert
    mockWeatherAPI().then((weatherAlert) => {
      if (weatherAlert) {
        alerts.push({ id: 2, message: 'Extreme weather alert! Expect high energy demands.', type: 'weather' });
      }
    });

    // Solar Selling Opportunity Alert (dummy data)
    const solarSellingPrice = 8.0; // Mock threshold price per kWh for selling back to the grid
    if (solarSellingPrice > 7.5) {
      alerts.push({ id: 3, message: 'Great opportunity to sell solar energy at a high rate!', type: 'solar' });
    }

    setNotifications(alerts);
  };

  // Mock API call to check for weather alerts (use a real API for actual implementation)
  const mockWeatherAPI = async () => {
    // Simulating API call delay
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const isExtremeWeather = Math.random() < 0.3; // 30% chance of extreme weather
        resolve(isExtremeWeather);
      }, 1000);
    });
  };

  useEffect(() => {
    fetchFirebaseData();
  }, []);

  return (
    <section className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">User Notifications and Alerts</h2>
      <p>Sends alerts for high tariff periods, extreme weather, and solar energy selling opportunities.</p>
      
      <div className="mt-4">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className={`p-3 mb-2 rounded ${notification.type === 'tariff' ? 'bg-red-100' : notification.type === 'weather' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                <p>{notification.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No new alerts at this time.</p>
        )}
      </div>
    </section>
  );
};

export default UserNotifications;
