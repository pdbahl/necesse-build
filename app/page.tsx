"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Weapon, Trinket, ArmorSet } from "@/lib/gameData";
import {
  weapons,
  trinkets,
  armorSets,
  weaponImages,
  trinketImages,
  armorImages,
} from "@/lib/gameData";

export default function Home() {
  const router = useRouter();
  const [weapon, setWeapon] = useState<Weapon | "">("");
  const [trinket, setTrinket] = useState<Trinket[]>([]);
  const [armor, setArmor] = useState<ArmorSet | "">("");
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

  const isFormValid = Boolean(weapon && armor && trinket.length > 0);

  // Small single-select dropdown with images for Weapon
  function WeaponDropdown({
    items,
    value,
    onChange,
  }: {
    items: Weapon[];
    value: Weapon | "";
    onChange: (v: Weapon) => void;
  }) {
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState<number>(-1);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function onDoc(e: MouseEvent) {
        if (!ref.current) return;
        if (!ref.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    useEffect(() => {
      if (!open) setHighlight(-1);
    }, [open]);

    return (
      <div className="relative flex-1" ref={ref}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center gap-3 px-3 py-3 h-12 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight(0);
            }
          }}
        >
          <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-600/30 flex items-center justify-center">
            {value ? (
              <Image src={weaponImages[value]} alt={value} width={32} height={32} />
            ) : (
              <div className="text-xs text-gray-300">No image</div>
            )}
          </div>
          <span className="flex-1 text-left">{value || "Select a weapon..."}</span>
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute z-20 mt-2 w-full max-h-64 overflow-auto bg-gray-800 border border-gray-700 rounded-md py-2"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlight((i) => Math.min(i + 1, items.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlight((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (highlight >= 0) {
                  onChange(items[highlight]);
                  setOpen(false);
                }
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
          >
            {items.map((it, idx) => (
              <li
                key={it}
                role="option"
                aria-selected={it === value}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-700 ${highlight === idx ? "bg-gray-700" : ""}`}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => {
                  onChange(it);
                  setOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-600/20">
                  <Image src={weaponImages[it]} alt={it} width={32} height={32} />
                </div>
                <span className="text-sm">{it}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Armor dropdown (same as weapon but typed for ArmorSet)
  function ArmorDropdown({
    items,
    value,
    onChange,
  }: {
    items: ArmorSet[];
    value: ArmorSet | "";
    onChange: (v: ArmorSet) => void;
  }) {
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState<number>(-1);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function onDoc(e: MouseEvent) {
        if (!ref.current) return;
        if (!ref.current.contains(e.target as Node)) setOpen(false);
      }
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    useEffect(() => {
      if (!open) setHighlight(-1);
    }, [open]);

    return (
      <div className="relative flex-1" ref={ref}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center gap-3 px-3 py-3 h-12 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setHighlight(0);
            }
          }}
        >
          <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-600/30 flex items-center justify-center">
            {value ? (
              <Image src={armorImages[value]} alt={value} width={32} height={32} />
            ) : (
              <div className="text-xs text-gray-300">No image</div>
            )}
          </div>
          <span className="flex-1 text-left">{value || "Select armor..."}</span>
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute z-20 mt-2 w-full max-h-64 overflow-auto bg-gray-800 border border-gray-700 rounded-md py-2"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlight((i) => Math.min(i + 1, items.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlight((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (highlight >= 0) {
                  onChange(items[highlight]);
                  setOpen(false);
                }
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
          >
            {items.map((it, idx) => (
              <li
                key={it}
                role="option"
                aria-selected={it === value}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-700 ${highlight === idx ? "bg-gray-700" : ""}`}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => {
                  onChange(it);
                  setOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-600/20">
                  <Image src={armorImages[it]} alt={it} width={32} height={32} />
                </div>
                <span className="text-sm">{it}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 relative">
          {/* background panel behind the title */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-2xl h-20 bg-black/50 dark:bg-black/70 backdrop-blur-sm rounded-2xl z-0 shadow-lg"></div>

          <h1 className="relative text-4xl font-bold text-white mb-2 z-10 inline-block px-4">
            Necesse Build Creator
          </h1>
          <p className="relative z-10 text-gray-400">
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
              <div className="flex items-center gap-4">
                <WeaponDropdown items={(weapons as readonly Weapon[] as unknown) as Weapon[]} value={weapon} onChange={(v) => setWeapon(v)} />
              </div>
            </div>

            <div>
              <label
                htmlFor="trinket"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Trinket
              </label>

              {/* Checkbox-based multi-select with icons so users can click to toggle without holding Ctrl */}
              <div className="w-full px-3 py-3 h-56 bg-gray-700 border border-gray-600 rounded-md text-white focus-within:ring-2 focus-within:ring-blue-500 overflow-auto">
                <div className="space-y-2">
                  {trinkets.map((t) => {
                    const checked = trinket.includes(t);
                    return (
                      <label
                        key={t}
                        className="flex items-center gap-3 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          value={t}
                          checked={checked}
                          onChange={() => {
                            setTrinket((prev) =>
                              prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                            );
                          }}
                          className="h-4 w-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-400"
                        />

                        <div className="w-6 h-6 flex-shrink-0 rounded-sm overflow-hidden bg-gray-600/20">
                          <Image src={trinketImages[t as Trinket]} alt={t} width={24} height={24} />
                        </div>

                        <span className="text-sm text-white">{t}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="armor"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Armor
              </label>
              <div className="flex items-center gap-4">
                <ArmorDropdown items={(armorSets as readonly ArmorSet[] as unknown) as ArmorSet[]} value={armor} onChange={(v) => setArmor(v)} />
              </div>
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
