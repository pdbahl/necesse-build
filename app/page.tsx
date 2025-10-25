"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Weapon, Trinket, ArmorSet, Build, Enchantment } from "@/lib/gameData";
import { enchantments } from "@/lib/gameData";
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
  // trinketSelections: array of { name: Trinket, enchantment?: Enchantment }
  const [trinket, setTrinket] = useState<Array<{ name: Trinket; enchantment?: Enchantment }>>([]);
  const [armor, setArmor] = useState<ArmorSet | "">("");
  // allow up to 3 enchantments for armor (may be empty strings until chosen)
  const [armorEnchantments, setArmorEnchantments] = useState<Array<Enchantment | "">>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // prepare armor payload: send as object with optional enchantments when available
      const filteredArmorEnchantments = (armorEnchantments || []).filter(Boolean) as Enchantment[];
      const armorPayload = armor
        ? (filteredArmorEnchantments.length > 0 ? { name: armor, enchantments: filteredArmorEnchantments } : { name: armor })
        : armor;

      const response = await fetch("/api/builds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weapon, trinket, armor: armorPayload, title, description }),
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

  const [randomBuilds, setRandomBuilds] = useState<Build[]>([]);

  // Render lists alphabetically for UI: don't mutate original exports
  const sortedWeapons = [...weapons].slice().sort((a, b) => a.localeCompare(b));
  const sortedTrinkets = [...trinkets].slice().sort((a, b) => a.localeCompare(b));
  const sortedArmorSets = [...armorSets].slice().sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    let mounted = true;
    fetch("/api/builds/random")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setRandomBuilds(data);
      })
      .catch((err) => {
        console.error("Failed to load random builds:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

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
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title (optional)
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short title for your build (optional)"
                className="w-full px-3 py-2 h-10 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description / Tips (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any notes or tips for this build (optional)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none h-24 resize-y"
              />
            </div>
            <div>
              <label
                htmlFor="weapon"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Weapon
              </label>
              <div className="flex items-center gap-4">
                <WeaponDropdown items={sortedWeapons} value={weapon} onChange={(v) => setWeapon(v)} />
              </div>
            </div>

            <div>
              <label
                htmlFor="trinket"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Trinket
              </label>

                          {/* Checkbox-based multi-select with per-trinket enchantment select */}
                          <div className="w-full px-3 py-3 h-56 bg-gray-700 border border-gray-600 rounded-md text-white focus-within:ring-2 focus-within:ring-blue-500 overflow-auto">
                          <div className="space-y-2">
                            {sortedTrinkets.map((t) => {
                                const selectedIndex = trinket.findIndex((s) => s.name === t);
                                const selected = selectedIndex >= 0;
                                return (
                                  <div key={t} className="flex items-center gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                                      <input
                                        type="checkbox"
                                        value={t}
                                        checked={selected}
                                        onChange={() => {
                                          setTrinket((prev) => {
                                            if (prev.find((x) => x.name === t)) {
                                              return prev.filter((x) => x.name !== t);
                                            }
                                            return [...prev, { name: t }];
                                          });
                                        }}
                                        className="h-4 w-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-400"
                                      />

                                      <div className="w-6 h-6 flex-shrink-0 rounded-sm overflow-hidden bg-gray-600/20">
                                        <Image src={trinketImages[t as Trinket]} alt={t} width={24} height={24} />
                                      </div>

                                      <span className="text-sm text-white">{t}</span>
                                    </label>

                                    {/* Enchantment select - shown when selected */}
                                    <div className="w-48">
                                      <select
                                        disabled={!selected}
                                        value={selected ? (trinket[selectedIndex].enchantment || "") : ""}
                                        onChange={(e) => {
                                          const val = e.target.value as Enchantment | "";
                                          setTrinket((prev) => {
                                            return prev.map((s) => (s.name === t ? { ...s, enchantment: val || undefined } : s));
                                          });
                                        }}
                                        className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 rounded disabled:opacity-60"
                                      >
                                        <option value="">No enchantment</option>
                                        {enchantments.map((enc) => (
                                          <option key={enc} value={enc}>
                                            {enc}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
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
                <ArmorDropdown items={sortedArmorSets} value={armor} onChange={(v) => { setArmor(v); setArmorEnchantments([]); }} />
                <div className="w-48">
                  <div className="bg-gray-800 border border-gray-600 rounded px-2 py-2">
                    <div className="text-xs text-gray-300 mb-1">Armor Enchantments (up to 3)</div>
                    <div className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <select
                          key={i}
                          value={armorEnchantments[i] || ""}
                          disabled={!armor}
                          onChange={(e) => {
                            const val = e.target.value as Enchantment | "";
                            setArmorEnchantments((prev) => {
                              const next = prev.slice();
                              // ensure array has enough slots
                              while (next.length <= i) next.push("");
                              next[i] = val;
                              return next;
                            });
                          }}
                          className="w-full bg-gray-800 border border-gray-600 text-white px-2 py-1 rounded"
                        >
                          <option value="">No enchantment</option>
                          {enchantments.map((enc) => (
                            <option key={enc} value={enc}>
                              {enc}
                            </option>
                          ))}
                        </select>
                      ))}
                    </div>
                  </div>
                </div>
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

        {/* Random builds panels */}
        <div className="max-w-md mx-auto mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Random Builds</h2>
          <div className="grid grid-cols-1 gap-4">
            {randomBuilds.length === 0 && (
              <div className="text-sm text-gray-400">No builds yet.</div>
            )}

            {randomBuilds.map((b) => {
              // defensive: coerce trinket field into an array of { name, enchantment? }
              let trinketSelections: Array<{ name: string; enchantment?: string }> = [];
              const raw = (b as any).trinket;
              if (Array.isArray(raw)) {
                if (raw.length > 0 && typeof raw[0] === "string") {
                  trinketSelections = raw.map((s: string) => ({ name: s }));
                } else {
                  trinketSelections = raw.map((r: any) => ({ name: r.name, enchantment: r.enchantment }));
                }
              } else if (typeof raw === "string") {
                try {
                  const parsed = JSON.parse(raw);
                  if (Array.isArray(parsed)) trinketSelections = parsed.map((s: any) => (typeof s === "string" ? { name: s } : { name: s.name, enchantment: s.enchantment }));
                } catch (err) {
                  trinketSelections = raw.split(",").map((s: string) => ({ name: s.trim() })).filter((x) => x.name);
                }
              }

              return (
              <a
                key={b.id}
                href={`/build/${b.id}`}
                className="block bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-600/20">
                    {b.weapon ? (
                      <Image src={weaponImages[b.weapon as Weapon]} alt={b.weapon} width={48} height={48} />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    {b.title ? (
                      <div className="text-sm font-semibold text-white">{b.title}</div>
                    ) : null}

                    <div className="text-sm font-medium text-gray-200">{b.weapon}</div>
                    <div className="text-xs text-gray-300">{new Date(b.createdAt).toLocaleString()}</div>

                    {b.description ? (
                      <div className="text-xs text-gray-300 mt-1 line-clamp-2">{b.description}</div>
                    ) : null}
                  </div>
                  {/* normalize armor which may be legacy string or object */}
                  {(() => {
                      const rawArmor = (b as any).armor;
                      let armorSelection: { name?: string; enchantments?: string[] } = { name: undefined };
                      if (typeof rawArmor === "string") armorSelection = { name: rawArmor };
                      else if (rawArmor && typeof rawArmor === "object") {
                        const rawE = rawArmor.enchantments ?? rawArmor.enchantment ?? undefined;
                        armorSelection = { name: rawArmor.name, enchantments: Array.isArray(rawE) ? rawE : typeof rawE === "string" ? [rawE] : undefined };
                      }

                      return (
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-600/20">
                          {armorSelection.name ? (
                            <Image src={(armorImages as any)[armorSelection.name]} alt={armorSelection.name} width={40} height={40} />
                          ) : null}
                        </div>
                      );
                  })()}
                  </div>

                <div className="mt-2 flex gap-2 items-center">
                  {trinketSelections.slice(0, 6).map((t) => (
                    <div key={t.name} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-sm overflow-hidden bg-gray-600/20">
                        <Image src={trinketImages[t.name as Trinket]} alt={t.name} width={24} height={24} />
                      </div>
                      <div className="text-xs text-gray-300">
                        {t.enchantment ? <span>{t.enchantment}</span> : <span className="text-transparent">no-enchant</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </a>);
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
