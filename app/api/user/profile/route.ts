import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: Number(userId) },
    });

    if (!profile) {
      return NextResponse.json(null); // no profile yet
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, height, weight, age, goal } = await req.json();

    if (!userId || !height || !weight || !age || !goal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const idn = Number(userId);
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: idn },
    });

    let profile;
    if (existingProfile) {
      profile = await prisma.userProfile.update({
        where: { userId: idn },
        data: { height, weight, age, goal },
      });
    } else {
      profile = await prisma.userProfile.create({
        data: { userId: idn, height, weight, age, goal },
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
