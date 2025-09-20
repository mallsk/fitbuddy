"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Calendar,
  Dumbbell,
  Clock,
  Timer,
  Play,
  User,
  X,
  Flame,
  Utensils,
  Trophy,
} from "lucide-react"


interface PlanResponse {
  needProfile?: boolean
  plan?: any // You can type this more strictly if you know the shape
}

// Types
interface Plan {
  workout: {
    exercises: { name: string; sets: number; reps?: number; time?: string; day?: string }[]
    frequency?: string
    focus?: string
    warmup?: string
    cooldown?: string
  }
  diet: {
    calorie_target?: string
    macronutrient_ratio?: string
    hydration?: string
    notes?: string
    meals: { time: string; items: string[] }[]
  }
  gamification?: string[]
  microWorkouts?: string[]
}

export default function DashboardPage() {
  const { data: session } = useSession()

  // Profile state
  const [showProfile, setShowProfile] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [height, setHeight] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
  const [age, setAge] = useState<number>(0)
  const [goal, setGoal] = useState<"fat" | "muscle" | "thin" | "endurance">("fat")

  // Josh Meter state
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // AI-Generated Plan
  const [plan, setPlan] = useState<Plan | null>(null)

  const energyLevels = [
    { value: 1, label: "Low Energy", color: "bg-red-500", description: "Feeling tired, need gentle movement" },
    { value: 2, label: "Below Average", color: "bg-orange-500", description: "Some energy, light workout preferred" },
    { value: 3, label: "Average", color: "bg-yellow-500", description: "Normal energy, ready for regular workout" },
    { value: 4, label: "High Energy", color: "bg-green-500", description: "Feeling great, ready to push harder" },
    { value: 5, label: "Peak Energy", color: "bg-primary", description: "Maximum energy, bring on the challenge!" },
  ]

  const selectedLevelData = energyLevels.find((level) => level.value === selectedLevel)

  // Fetch user profile
  useEffect(() => {
    if (!session?.user?.id) return
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/user/profile?userId=${session.user.id}`)
        const data = res.data as { height?: number; weight?: number; age?: number; goal?: "fat" | "muscle" | "thin" | "endurance"; };
        if (data && (data.height || data.weight || data.age || data.goal)) {
          setHeight(data.height ?? 0)
          setWeight(data.weight ?? 0)
          setAge(data.age ?? 0)
          setGoal(data.goal ?? "fat")
          setProfile(data)
        } else {
          setShowProfile(true)
        }
      } catch {
        setShowProfile(true)
      }
    }
    fetchProfile()
  }, [session?.user?.id])

  const saveProfile = async () => {
    if (!session?.user?.id) return
    try {
      await axios.post("/api/user/profile", { userId: session.user.id, height, weight, age, goal })
      setShowProfile(false)
      setProfile({ height, weight, age, goal })
      alert("Profile saved!")
    } catch {
      alert("Failed to save profile.")
    }
  }

  // Submit Josh Meter
  const handleJoshSubmit = async () => {
    if (!selectedLevel || !session?.user?.id) return

    setIsSubmitted(true)

    try {
      // Replace with your AI plan endpoint
      const res = await axios.post<PlanResponse>("/api/plan/generate", {
        userId: session.user.id,
        energyLevel: selectedLevelData?.label.toLowerCase(),
      })
      if (res.data.needProfile) setShowProfile(true)
      else setPlan(res.data.plan)
    } catch {
      alert("Failed to fetch plan.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">FitBuddy</h1>
              <p className="text-xs text-muted-foreground">Personal Workout Coach</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
            </div>

            {/* User / Profile Button */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowProfile(true)}>
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Josh Meter Check-in */}
        {isSubmitted && selectedLevelData ? (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Josh Meter Check-in Complete
                <Badge variant="secondary" className={selectedLevelData.color}>
                  {selectedLevelData.label}
                </Badge>
              </CardTitle>
              <CardDescription>Your workout has been adapted based on your energy level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Progress value={selectedLevel! * 20} className="flex-1" />
                <span className="text-2xl font-bold text-primary">{selectedLevel}/5</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{selectedLevelData.description}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle>Daily Josh Meter Check-in</CardTitle>
              <CardDescription>
                How's your energy and motivation today? This helps us customize your workout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {energyLevels.map((level) => (
                  <Button
                    key={level.value}
                    variant={selectedLevel === level.value ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                    onClick={() => setSelectedLevel(level.value)}
                  >
                    <div className={`w-4 h-4 rounded-full ${level.color}`} />
                    <span className="text-xs font-medium">{level.value}</span>
                    <span className="text-xs text-center">{level.label}</span>
                  </Button>
                ))}
              </div>

              {selectedLevel && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">{selectedLevelData?.description}</p>
                  <Button onClick={handleJoshSubmit} className="w-full sm:w-auto">
                    Generate Today's Workout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Workout & Diet */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workout Card */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" /> Today's Workout
                </CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 45 min
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSubmitted && plan ? (
                  plan.workout.exercises.map((ex, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{ex.name}</h4>
                        <p className="text-sm text-muted-foreground">{ex.day || ""}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{ex.sets} sets</p>
                        <p className="text-sm text-muted-foreground">{ex.reps ? `${ex.reps} reps` : ex.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Complete your Josh Meter check-in above to see your personalized workout plan.</p>
                  </div>
                )}

                {isSubmitted && (
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">
                      <Play className="w-4 h-4 mr-2" /> Start Workout
                    </Button>
                    <Button variant="outline">
                      <Timer className="w-4 h-4 mr-2" /> Set Timer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Diet Plan */}
            {plan?.diet && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-primary" /> Today's Nutrition Plan
                  </CardTitle>
                  <CardDescription>
                    {selectedLevelData ? `Optimized for ${selectedLevelData.label} workout` : "Balanced nutrition plan"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.diet.meals.map((meal, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{meal.time}</h4>
                        <p className="text-sm text-muted-foreground">{meal.items.join(" OR ")}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Fast access to common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">Log Previous Workout</Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">Track Meal</Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">Quick 5-min Stretch</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Card className="w-96 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setShowProfile(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <CardHeader>
              <CardTitle className="text-center text-blue-700">Profile & Goal</CardTitle>
              <CardDescription className="text-center">Set your personal details and fitness goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Height (cm)</label>
                <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Weight (kg)</label>
                <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Age</label>
                <Input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Goal</label>
                <Select value={goal} onValueChange={(value) => setGoal(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fat">Fat Loss</SelectItem>
                    <SelectItem value="muscle">Muscle Gain</SelectItem>
                    <SelectItem value="thin">Gain Weight</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowProfile(false)}>Cancel</Button>
                <Button onClick={saveProfile}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
