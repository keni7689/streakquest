"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Circle, Flame } from "lucide-react"
import type { Habit } from "@/lib/types"
import { getTodayString } from "@/lib/storage"

interface DailyChecklistProps {
  habits: Habit[]
  onToggleCompletion: (habitId: string, completed: boolean) => void
}

export function DailyChecklist({ habits, onToggleCompletion }: DailyChecklistProps) {
  const today = getTodayString()
  const [completingHabits, setCompletingHabits] = useState<Set<string>>(new Set())

  const todayCompletions = habits.map((habit) => ({
    ...habit,
    completedToday: habit.completions.includes(today),
  }))

  const completedCount = todayCompletions.filter((h) => h.completedToday).length
  const totalHabits = habits.length

  const handleToggle = async (habitId: string, currentlyCompleted: boolean) => {
    setCompletingHabits((prev) => new Set(prev).add(habitId))

    try {
      onToggleCompletion(habitId, !currentlyCompleted)
    } finally {
      setCompletingHabits((prev) => {
        const newSet = new Set(prev)
        newSet.delete(habitId)
        return newSet
      })
    }
  }

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">No habits to track today</h3>
            <p className="text-muted-foreground">Add some habits to start building your streaks!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Habits
          </CardTitle>
          <Badge variant={completedCount === totalHabits ? "default" : "secondary"} className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {completedCount}/{totalHabits}
          </Badge>
        </div>
        {completedCount === totalHabits && totalHabits > 0 && (
          <div className="flex items-center gap-2 text-sm text-accent font-medium">
            <Flame className="h-4 w-4" />
            Perfect day! All habits completed!
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {todayCompletions.map((habit) => (
          <div
            key={habit.id}
            className={`
              flex items-center gap-4 p-4 rounded-lg border transition-all duration-200
              ${
                habit.completedToday
                  ? "bg-accent/10 border-accent/30 shadow-sm"
                  : "bg-card hover:bg-secondary/50 border-border"
              }
            `}
          >
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => handleToggle(habit.id, habit.completedToday)}
                disabled={completingHabits.has(habit.id)}
                className="flex-shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
              >
                {habit.completedToday ? (
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
                )}
              </button>

              <span className="text-2xl">{habit.emoji}</span>

              <div className="flex-1">
                <h4
                  className={`font-medium transition-colors ${
                    habit.completedToday ? "text-accent line-through" : "text-card-foreground"
                  }`}
                >
                  {habit.name}
                </h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {habit.currentStreak} day streak
                  </span>
                  <span>Best: {habit.longestStreak} days</span>
                </div>
              </div>
            </div>

            {/* XP indicator */}
            <div className="text-right">
              <div
                className={`text-sm font-medium transition-colors ${
                  habit.completedToday ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {habit.completedToday ? "+10 XP" : "10 XP"}
              </div>
            </div>
          </div>
        ))}

        {/* Progress summary */}
        <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-card-foreground">Daily Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalHabits} completed
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
              style={{
                width: totalHabits > 0 ? `${(completedCount / totalHabits) * 100}%` : "0%",
              }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            {completedCount === totalHabits && totalHabits > 0
              ? "🎉 Amazing work! You've completed all your habits today!"
              : `${totalHabits - completedCount} habits remaining`}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
