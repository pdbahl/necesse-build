import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveBuild } from "@/lib/mongodb";
import { weapons, trinkets, armorSets } from "@/lib/gameData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weapon, trinket, armor, title, description } = body;

    // Validate the input (title/description are optional)
    if (!weapon || !trinket || !armor) {
      return NextResponse.json(
        { error: "Missing required fields: weapon, trinket, or armor" },
        { status: 400 }
      );
    }

    // Validate that the weapon and armor are valid options
    if (!weapons.includes(weapon)) {
      return NextResponse.json(
        { error: "Invalid weapon" },
        { status: 400 }
      );
    }

    // armor may be a string (legacy) or an object { name, enchantments }
    let normalizedArmor: any = null;
    if (typeof armor === "string") {
      normalizedArmor = { name: armor };
    } else if (armor && typeof armor === "object") {
      // armor.enchantments may be a single value or an array
      const raw = armor.enchantments ?? armor.enchantment ?? undefined;
      let ench: any[] | undefined;
      if (Array.isArray(raw)) ench = raw;
      else if (typeof raw === "string") ench = [raw];
      normalizedArmor = { name: armor.name, enchantments: ench };
    }

    if (!normalizedArmor || typeof normalizedArmor.name !== "string" || !armorSets.includes(normalizedArmor.name)) {
      return NextResponse.json(
        { error: "Invalid armor" },
        { status: 400 }
      );
    }

    // Validate trinket shape: accept legacy array of strings or new array of { name, enchantment }
    let normalizedTrinkets: any[] = [];

    if (Array.isArray(trinket) && trinket.length > 0) {
      if (typeof trinket[0] === "string") {
        // legacy format: array of strings
        normalizedTrinkets = trinket.map((t: string) => ({ name: t }));
      } else {
        // new format: validate objects
        normalizedTrinkets = trinket.map((t: any) => ({ name: t.name, enchantment: t.enchantment }));
      }
    }

    // Basic validation: ensure at least one trinket exists after normalization
    if (!Array.isArray(normalizedTrinkets) || normalizedTrinkets.length === 0) {
      return NextResponse.json({ error: "trinket must be a non-empty array" }, { status: 400 });
    }

    // Validate each trinket name and optional enchantment
    const { enchantments } = await import("@/lib/gameData");
    for (const t of normalizedTrinkets) {
      if (!t || typeof t.name !== "string" || !trinkets.includes(t.name)) {
        return NextResponse.json({ error: `Invalid trinket: ${JSON.stringify(t)}` }, { status: 400 });
      }
      if (t.enchantment && !enchantments.includes(t.enchantment)) {
        return NextResponse.json({ error: `Invalid enchantment for ${t.name}: ${t.enchantment}` }, { status: 400 });
      }
    }

    // Validate armor enchantments if present (max 3)
    if (normalizedArmor.enchantments) {
      if (!Array.isArray(normalizedArmor.enchantments) || normalizedArmor.enchantments.length > 3) {
        return NextResponse.json({ error: "Armor enchantments must be an array with at most 3 items" }, { status: 400 });
      }
      for (const enc of normalizedArmor.enchantments) {
        if (!enchantments.includes(enc)) {
          return NextResponse.json({ error: `Invalid armor enchantment: ${enc}` }, { status: 400 });
        }
      }
    }

    // Create the build
    const build = {
      id: uuidv4(),
      weapon,
      trinket: normalizedTrinkets,
      armor: normalizedArmor,
      createdAt: new Date().toISOString(),
      ...(typeof title === "string" && title.trim() ? { title: title.trim() } : {}),
      ...(typeof description === "string" && description.trim() ? { description: description.trim() } : {}),
    } as const;

    // Save to MongoDB
    await saveBuild(build as any);

    return NextResponse.json(build, { status: 201 });
  } catch (error) {
    console.error("Error creating build:", error);
    return NextResponse.json(
      { error: "Failed to create build" },
      { status: 500 }
    );
  }
}
