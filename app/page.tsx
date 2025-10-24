"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { weapons, trinkets, armorSets } from "@/lib/gameData";

export default function Home() {
  const router = useRouter();
  const [weapon, setWeapon] = useState("");
  const [trinket, setTrinket] = useState<string[]>([]);
  const [armor, setArmor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weapon, trinket, armor }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create build");
      }

      const build = await response.json();
      router.push(`/build/${build.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = weapon && trinket && armor;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Necesse Build Creator
          </h1>
          <p className="text-gray-400">
            Create and share your perfect build
          </p>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="weapon"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Weapon
              </label>
              <select
                id="weapon"
                value={weapon}
                onChange={(e) => setWeapon(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a weapon...</option>
                {weapons.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="trinket"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Trinket
              </label>
              <select
                id="trinket"
                multiple
                value={trinket}
                onChange={(e) => {
                    const selectedOptions = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setTrinket(selectedOptions);
                  }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a trinket...</option>
                {trinkets.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="armor"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Armor
              </label>
              <select
                id="armor"
                value={armor}
                onChange={(e) => setArmor(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select armor...</option>
                {armorSets.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? "Creating Build..." : "Create Build"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
