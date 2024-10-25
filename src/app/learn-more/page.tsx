"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from 'react';

const SavingsCalculator: React.FC = () => {
  const [bill, setBill] = useState<number | ''>('');
  const [estimatedSavings, setEstimatedSavings] = useState<number | null>(null);

  // Function to calculate savings
  const calculateSavings = () => {
    const monthlyBill = typeof bill === 'number' ? bill : 0;

    // Assuming a savings rate of 20% based on optimization suggestions
    const savingsRate = 0.20;
    const estimated = monthlyBill * savingsRate;

    setEstimatedSavings(estimated);
  };

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Calculate Your Savings</h2>
      <div className="flex flex-col items-center">
        <input
          type="number"
          placeholder="Enter monthly energy bill (₹)"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
          className="border rounded-md p-2 mb-4"
        />
        <Button onClick={calculateSavings}>Calculate Potential Savings</Button>
        {estimatedSavings !== null && (
          <p className="mt-4 text-blue-700">Estimated Savings: ₹{estimatedSavings.toFixed(2)}</p>
        )}
      </div>
    </section>
  );
};

const LearnMore: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
        </div>
      </main>
          {/* Introduction Section */}
          <section className="text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-800">
              Understanding Solar Energy
            </h1>
            <p className="text-md text-blue-600 mt-4">
              Learn about the benefits and workings of solar energy systems to make informed decisions for your energy needs.
            </p>
          </section>

          {/* Benefits Section */}
          <section className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-blue-800">Sustainable Power</h3>
              <p className="text-blue-600">Harness the sun’s energy for a cleaner planet.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-blue-800">Savings Unleashed</h3>
              <p className="text-blue-600">Maximize your savings with reduced energy bills.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-blue-800">Energy Security</h3>
              <p className="text-blue-600">Achieve energy independence and resilience.</p>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-10">
            <h2 className="text-3xl font-bold mb-6 text-blue-800">How Solar Energy Systems Function</h2>
            <p className="text-blue-700 mb-4">
              Solar panels capture sunlight and convert it into electricity for your home or business.
            </p>
            <div className="flex justify-center">
              <Image
                src="/solar_panel_working.png" // Replace with your relevant image
                alt="Diagram explaining how solar energy works"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </section>

          {/* Customer Testimonials Section */}
          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-4 text-blue-800 text-center">What Our Customers Are Saying</h2>
            <blockquote className="text-lg text-blue-600 italic text-center">
              "The transition to solar has been seamless and beneficial for our family!" - <em>Ramesh Sharma</em>
            </blockquote>
          </section>

          {/* Innovations in Solar Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Latest Innovations in Solar Technology</h2>
            <p className="text-blue-700 mb-4">
              Discover cutting-edge technologies that enhance solar energy systems.
            </p>
            <div className="flex flex-wrap justify-around">
              <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-blue-800">Smart Inverters</h3>
                <p className="text-blue-600">Increase efficiency and optimize power output.</p>
              </div>
              <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-blue-800">Hybrid Systems</h3>
                <p className="text-blue-600">Integrate solar with other renewable sources for better reliability.</p>
              </div>
            </div>
          </section>

          {/* Installation Process Section */}
          <section className="py-10">
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Steps to Install Your Solar System</h2>
            <ol className="list-decimal list-inside text-blue-700">
              <li>Consultation: Understand your energy needs.</li>
              <li>Design: Custom solutions tailored for your situation.</li>
              <li>Installation: Professional setup by our experienced team.</li>
              <li>Support: Ongoing assistance to ensure optimal performance.</li>
            </ol>
          </section>

          {/* Energy Savings Calculator Section */}
          <SavingsCalculator />

          {/* Myth vs. Reality Section */}
          <section className="py-10">
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Solar Myths vs. Reality</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-blue-800">Myth: Solar panels are too expensive.</h3>
                <p className="text-blue-600">Reality: Solar panels can save you money over time and are more affordable than ever.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-blue-800">Myth: Solar energy is unreliable.</h3>
                <p className="text-blue-600">Reality: Solar technology has advanced significantly, making it a reliable energy source.</p>
              </div>
            </div>
          </section>

          {/* Environmental Impact Section */}
          <section className="py-10">
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Environmental Benefits</h2>
            <p className="text-blue-700 mb-4">
              Solar energy helps reduce greenhouse gas emissions and conserves water compared to traditional energy sources.
            </p>
            <div className="flex justify-center">
              <Image
                src="/environmental-impact-chart.png" // Example image path
                alt="Environmental impact of solar energy"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-10">
            <h2 className="text-3xl font-bold mb-6 text-blue-800">Frequently Asked Questions</h2>
        
            <details className="mb-4">
              <summary className="font-semibold cursor-pointer text-blue-800">How long do solar panels last?</summary>
              <p className="text-blue-600">Most solar panels last between 25 to 30 years.</p>
            </details>
            <details className="mb-4">
              <summary className="font-semibold cursor-pointer text-blue-800">Do I need to maintain my solar panels?</summary>
              <p className="text-blue-600">Regular cleaning and inspections can help ensure optimal performance.</p>
            </details>
            <details className="mb-4">
              <summary className="font-semibold cursor-pointer text-blue-800">What are the financial incentives for installing solar?</summary>
              <p className="text-blue-600">Many regions offer tax credits, rebates, and financing options to help with the cost.</p>
            </details>
            <details className="mb-4">
              <summary className="font-semibold cursor-pointer text-blue-800">Can I install solar panels on a rental property?</summary>
              <p className="text-blue-600">Yes, but it typically requires landlord approval and collaboration.</p>
            </details>
            <details className="mb-4">
              <summary className="font-semibold cursor-pointer text-blue-800">How do solar panels work on cloudy days?</summary>
              <p className="text-blue-600">Solar panels can still generate electricity even on cloudy days, though at a reduced capacity.</p>
            </details>
            <details className="mb-4">
              <summary className="font-semibold cursor-pointer text-blue-800">What is net metering?</summary>
              <p className="text-blue-600">Net metering allows you to earn credits for excess energy your solar system produces.</p>
            </details>
            <details className="mb-4">
              <summary className="font-semibold cursor-pointer text-blue-800">Can solar panels increase my home’s value?</summary>
              <p className="text-blue-600">Yes, homes with solar systems can have a higher resale value.</p>
            </details>
            <details className="mb-4">
              <summary className="font-semibold cursor-pointer text-blue-800">Are solar panels safe during storms?</summary>
              <p className="text-blue-600">Yes, solar panels are designed to withstand harsh weather conditions.</p>
            </details>
          </section>

          {/* Call to Action Section */}
<section className="text-center">
  <h2 className="text-3xl font-bold mb-4 text-blue-800">Ready to Make the Switch?</h2>
  <p className="text-blue-600 mb-0">Join the solar revolution today!</p>
  <Link href="/sign-in">
    <Button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500">
      Get Started
    </Button>
  </Link>
</section>

{/* Additional Resources Section */}
<section className="bg-blue-50 p-6 rounded-lg">
  <h2 className="text-3xl font-bold mb-6 text-blue-800 text-center">Additional Resources</h2>
  <ul className="list-disc list-inside text-blue-700">
    <li>
      Solar Energy Basics: 
      <Link href="https://solarenergyscout.com/solar-panels-101/" className="text-blue-600 underline"> Click Here</Link>
    </li>
    <li>
      Local Solar Programs: 
      <Link href="https://www.myscheme.gov.in/schemes/pmsgmb" className="text-blue-600 underline"> Click Here</Link>
    </li>
  </ul>
</section>
      {/* Footer Section */}
      <footer className="bg-blue-700 text-white py-4">
        <div className="max-w-5xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Vidyut Mitra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;


