import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Profile {
  height: number;
  weight: number;
  age: number;
  goal: "fat" | "muscle" | "thin" | "endurance";
}

export default async function generateFitBuddyPlan(profile: Profile, energyLevel: string) {
  const prompt = `
Generate a personalized workout and diet plan for a user with the following profile:
Height: ${profile.height} cm
Weight: ${profile.weight} kg
Age: ${profile.age}
Goal: ${profile.goal}
Current energy/motivation: ${energyLevel}

Return the plan strictly as JSON in this format:

{
  "workout": {
    "exercises": [
      { "name": "Push Ups", "sets": 3, "reps": 15 }
    ]
  },
  "diet": {
    "meals": [
      { "time": "Breakfast", "items": ["Oats", "Banana"] }
    ]
  }
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  // Guard against undefined
  let text = response.text ?? "";
  text = text.trim();

  // Remove backticks or Markdown code formatting
  if (text.startsWith("```")) {
    text = text.replace(/```(json)?/g, "").trim();
  }

  try {
    const data = JSON.parse(text);
    return data;
  } catch (err) {
    console.error("Failed to parse AI response:", text);
    throw new Error("AI response is not valid JSON");
  }
}
