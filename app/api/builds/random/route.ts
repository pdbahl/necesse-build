import { NextResponse } from "next/server";
import { getBuildsCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getBuildsCollection();
    // Use aggregation $sample to return 3 random documents
    const docs = await collection.aggregate([{ $sample: { size: 3 } }]).toArray();

    return NextResponse.json(docs || []);
  } catch (error) {
    console.error("Error fetching random builds:", error);
    return NextResponse.json({ error: "Failed to fetch random builds" }, { status: 500 });
  }
}
