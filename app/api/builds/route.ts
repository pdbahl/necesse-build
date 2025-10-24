import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveBuild } from "@/lib/mongodb";
import { weapons, trinkets, armorSets } from "@/lib/gameData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weapon, trinket, armor } = body;

    // Validate the input
    if (!weapon || !trinket || !armor) {
      return NextResponse.json(
        { error: "Missing required fields: weapon, trinket, or armor" },
        { status: 400 }
      );
    }

    // Validate that the values are valid options
    if (!weapons.includes(weapon)) {
      return NextResponse.json(
        { error: "Invalid weapon" },
        { status: 400 }
      );
    }

    /*
    if (!trinkets.includes(trinket)) {
      return NextResponse.json(
        { error: "Invalid trinket" },
        { status: 400 }
      );
    }
*/
    if (!armorSets.includes(armor)) {
      return NextResponse.json(
        { error: "Invalid armor" },
        { status: 400 }
      );
    }

    // Create the build
    const build = {
      id: uuidv4(),
      weapon,
      trinket,
      armor,
      createdAt: new Date().toISOString(),
    };

    // Save to MongoDB
    await saveBuild(build);

    return NextResponse.json(build, { status: 201 });
  } catch (error) {
    console.error("Error creating build:", error);
    return NextResponse.json(
      { error: "Failed to create build" },
      { status: 500 }
    );
  }
}
