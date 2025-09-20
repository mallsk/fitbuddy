"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      setShowPopup(false);
      router.push("/user");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6 shadow-md bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <h1 className="text-2xl font-bold tracking-wide">FitBuddy</h1>
        <nav className="hidden md:flex gap-6 font-medium">
          <a href="#" className="hover:underline">Home</a>
          <a href="#features" className="hover:underline">Features</a>
          <a href="#plans" className="hover:underline">Plans</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
        <div>
          <button
            onClick={() => setShowPopup(true)}
            className="px-4 py-2 bg-white text-blue-700 rounded font-semibold hover:bg-gray-200"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 text-center py-20 px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-800">
            Welcome to FitBuddy
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Your personal adaptive workout and nutrition coach. Stay consistent, track progress, and achieve your fitness goals.
          </p>
          <button
            onClick={() => setShowPopup(true)}
            className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-800"
          >
            Get Started
          </button>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-10 bg-white text-center">
          <h3 className="text-3xl font-bold mb-8 text-blue-800">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow hover:shadow-lg">
              <h4 className="text-xl font-semibold mb-2">Adaptive Workouts</h4>
              <p className="text-gray-600">Personalized daily workouts based on your energy and progress.</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg">
              <h4 className="text-xl font-semibold mb-2">Nutrition Plans</h4>
              <p className="text-gray-600">Diet recommendations aligned with your fitness goals and workout intensity.</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg">
              <h4 className="text-xl font-semibold mb-2">Progress Dashboard</h4>
              <p className="text-gray-600">Track workouts, energy trends, streaks, and diet adherence visually.</p>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="plans" className="py-16 px-10 bg-gray-50 text-center">
          <h3 className="text-3xl font-bold mb-8 text-blue-800">Our Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-2">Beginner</h4>
              <p className="text-gray-600">Light workouts and basic nutrition guidance to get started.</p>
            </div>
            <div className="p-6 border rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-2">Intermediate</h4>
              <p className="text-gray-600">Moderate intensity workouts with tailored diet plans.</p>
            </div>
            <div className="p-6 border rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-2">Advanced</h4>
              <p className="text-gray-600">High-intensity routines and nutrition for serious fitness goals.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-blue-800 text-white text-center py-6 mt-10">
        <p>© {new Date().getFullYear()} FitBuddy. All Rights Reserved.</p>
        <p className="text-sm mt-1">Contact: support@fitbuddy.com</p>
      </footer>

      {/* Login Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl mb-4 font-semibold text-center text-blue-700">Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
