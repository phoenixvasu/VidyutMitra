"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Line } from "react-chartjs-2"; // Import Line for the savings graph
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Import required components from Chart.js
import { Leaf, PiggyBank, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Register the components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);

    // Check if the user is authenticated
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // Redirect based on whether the user document exists
      if (userDocSnap.exists()) {
        await router.push("/dashboard");
      } else {
        await router.push("/onboarding");
      }
    } else {
      await router.push("/sign-in"); // Redirect to sign-in page if user is not authenticated
    }

    setIsLoading(false); // Stop loading state after navigation
  };

  // Dummy data for the savings graph
  const savingsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Labels for the X-axis
    datasets: [
      {
        label: 'Savings (Rs)',
        data: [70, 75, 100, 110], // Sample savings data
        borderColor: 'rgba(75, 192, 192, 1)', // Color of the line
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color below the line
        fill: true,
        tension: 0.3, // Smoothness of the line
      },
    ],
  };

  const savingsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Savings Overview',
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      <main className="flex-1">
        {/* Shine Bright Section */}
        <section className="relative flex flex-col items-center justify-center h-[90vh] bg-[url('/phototwo.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center space-y-4 text-center text-white">
            <div className="space-y-2">
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
                Shine Bright with VidyutMitra
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                Harness solar energy, cut down on costs, and embrace a greener lifestyle today!
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:from-indigo-700 hover:to-indigo-800"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Start Saving Now"}
            </Button>
          </div>
        </section>

        {/* Solar Panel Image Section */}
        <section className="w-full py-16 bg-indigo-50 flex flex-col items-center">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-4xl font-bold text-indigo-900 mb-8">
              Capture the Sun's Power
            </h2>
            <div className="flex justify-center">
              <Image
                src="/photoone.jpg"
                alt="Solar Panels"
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
            <p className="text-lg text-gray-700 mt-4">
              Discover how solar panels can transform your energy consumption and boost savings.
            </p>
          </div>
        </section>

        {/* Real-Time Savings Section */}
        <section className="w-full py-16 bg-white flex flex-col items-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">
              Real-Time Energy Savings Insights
            </h2>
            <p className="text-lg text-center text-gray-700 mb-4">
              See how much you've saved over the last week or month using VidyutMitra.
            </p>
            <div className="flex justify-center">
              <Line data={savingsData} options={savingsOptions} className="shadow-lg" />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-16 bg-gradient-to-r from-indigo-50 to-white flex flex-col items-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8">How It Works</h2>
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-10">
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                {/* <Sun className="h-6 w-6 text-indigo-600" /> */}
                <h3 className="text-xl font-semibold text-indigo-900 mt-2">Monitor Energy Usage</h3>
                <p className="text-sm text-gray-600">Track your solar energy production and consumption in real-time.</p>
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                {/* <PiggyBank className="h-6 w-6 text-indigo-600" /> */}
                <h3 className="text-xl font-semibold text-indigo-900 mt-2">Smart Energy Management</h3>
                <p className="text-sm text-gray-600">Automatically shift usage to off-peak times to save money.</p>
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                {/* <Leaf className="h-6 w-6 text-indigo-600" /> */}
                <h3 className="text-xl font-semibold text-indigo-900 mt-2">Eco-friendly Practices</h3>
                <p className="text-sm text-gray-600">See your contribution to reducing carbon emissions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section id="success-stories" className="w-full py-16 bg-white flex flex-col items-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8">Success Stories</h2>
            <p className="text-lg text-center text-gray-700 mb-8">
              Hear from users who have saved big with VidyutMitra.
            </p>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
              <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-900">Mohit Gupta</h3>
                <p className="text-sm text-gray-600">"I've reduced my energy bills by 40% since using VidyutMitra."</p>
              </div>
              <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-indigo-900">Aman Bansal</h3>
                <p className="text-sm text-gray-600">"Thanks to VidyutMitra, I've optimized my solar energy and saved tons on energy costs."</p>
              </div>
           
              </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-16 bg-gradient-to-r from-indigo-50 to-indigo-100 flex flex-col items-center">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Join the Solar Revolution!</h2>
            <p className="text-lg text-gray-700 mb-8">
              Experience the benefits of solar energy today and start saving.
            </p>
            <Button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700"
              onClick={handleGetStarted}
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="w-full py-6 bg-indigo-800 text-white text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} VidyutMitra. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
