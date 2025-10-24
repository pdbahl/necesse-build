import { NextRequest, NextResponse } from "next/server";
import { getBuild } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Build ID is required" },
        { status: 400 }
      );
    }

    const build = await getBuild(id);

    if (!build) {
      return NextResponse.json(
        { error: "Build not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(build);
  } catch (error) {
    console.error("Error fetching build:", error);
    return NextResponse.json(
      { error: "Failed to fetch build" },
      { status: 500 }
    );
  }
}
