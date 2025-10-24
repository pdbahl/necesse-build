"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Build } from "@/lib/gameData";

export default function BuildPage() {
  const params = useParams();
  const router = useRouter();
  const [build, setBuild] = useState<Build | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const response = await fetch(`/api/builds/${params.id}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch build");
        }

        const data = await response.json();
        setBuild(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBuild();
    }
  }, [params.id]);

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading build...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 max-w-md w-full">
          <div className="text-red-400 text-xl mb-4">Error</div>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create a New Build
          </button>
        </div>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Build not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Necesse Build
          </h1>
          <p className="text-gray-400">
            Created on {new Date(build.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-lg p-8 mb-6">
          <div className="space-y-6">
            <div className="border-b border-gray-700 pb-4">
              <h2 className="text-sm font-medium text-gray-400 mb-2">WEAPON</h2>
              <p className="text-2xl font-bold text-white">{build.weapon}</p>
            </div>

            <div className="border-b border-gray-700 pb-4">
              <h2 className="text-sm font-medium text-gray-400 mb-2">TRINKET</h2>
               <div className="space-y-1">
                  {build.trinket.map((trinket, index) => (
                  <p key={index} className="text-2xl font-bold text-white">{trinket}</p>
                  ))}
              </div>
            </div>

            <div className="pb-4">
              <h2 className="text-sm font-medium text-gray-400 mb-2">ARMOR</h2>
              <p className="text-2xl font-bold text-white">{build.armor}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={copyToClipboard}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-colors"
          >
            {copied ? "Copied!" : "Copy Share Link"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
          >
            Create New Build
          </button>
        </div>
      </div>
    </div>
  );
}
