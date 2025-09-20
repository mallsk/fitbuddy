// app/api/plan/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import generateFitBuddyPlan from "@/lib/genAi";

export async function POST(req: Request) {
  try {
    const { userId, energyLevel } = await req.json();

    if (!userId || !energyLevel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const idn = Number(userId);

    // Fetch user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId: idn },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found. Please add your profile first." }, { status: 400 });
    }

    // Call Gemini AI to generate plan
    const aiPlan = await generateFitBuddyPlan(
      {
        height: profile.height,
        weight: profile.weight,
        age: profile.age,
        goal: profile.goal as "fat" | "muscle" | "thin" | "endurance",
      },
      energyLevel
    );


    return NextResponse.json({ success: true, plan: aiPlan });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
