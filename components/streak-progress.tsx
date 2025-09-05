"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, Target, AlertTriangle } from "lucide-react"
import type { Habit } from "@/lib/types"
import { getNextStreakMilestone, isStreakAtRisk } from "@/lib/game-logic"

interface StreakProgressProps {
  habits: Habit[]
}

export function StreakProgress({ habits }: StreakProgressProps) {
  const activeStreaks = habits.filter((habit) => habit.currentStreak > 0)
  const riskyHabits = habits.filter(isStreakAtRisk)

  if (habits.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-accent" />
          Streak Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* At-Risk Streaks Warning */}
        {riskyHabits.length > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive">Streaks at Risk!</span>
            </div>
            <div className="space-y-1">
              {riskyHabits.map((habit) => (
                <p key={habit.id} className="text-sm text-muted-foreground">
                  {habit.emoji} {habit.name} - {habit.currentStreak} day streak
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Active Streaks */}
        {activeStreaks.length > 0 ? (
          <div className="space-y-3">
            {activeStreaks.map((habit) => {
              const nextMilestone = getNextStreakMilestone(habit.currentStreak)
              const progress = nextMilestone ? (habit.currentStreak / nextMilestone.days) * 100 : 100

              return (
                <div key={habit.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{habit.emoji}</span>
                      <span className="font-medium text-card-foreground">{habit.name}</span>
                      <Badge variant="secondary" className="gap-1">
                        <Flame className="h-3 w-3" />
                        {habit.currentStreak}
                      </Badge>
                    </div>
                    {nextMilestone && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Next: {nextMilestone.title}</p>
                        <p className="text-xs font-medium">
                          {habit.currentStreak}/{nextMilestone.days} days
                        </p>
                      </div>
                    )}
                  </div>

                  {nextMilestone && (
                    <div className="space-y-1">
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          Progress to {nextMilestone.emoji} {nextMilestone.title}
                        </span>
                        <span>+{nextMilestone.xpBonus} XP bonus</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No active streaks yet</p>
            <p className="text-sm text-muted-foreground">Complete habits to start building streaks!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
