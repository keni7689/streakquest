"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Zap, Trophy } from "lucide-react"
import type { Habit, UserProgress } from "@/lib/types"
import { getTodayString } from "@/lib/storage"

interface QuickStatsProps {
  habits: Habit[]
  userProgress: UserProgress
}

export function QuickStats({ habits, userProgress }: QuickStatsProps) {
  const today = getTodayString()
  const completedToday = habits.filter((habit) => habit.completions.includes(today)).length
  const totalStreakDays = habits.reduce((sum, habit) => sum + habit.currentStreak, 0)
  const activeHabits = habits.filter((habit) => habit.currentStreak > 0).length

  const stats = [
    {
      icon: Target,
      label: "Completed Today",
      value: completedToday,
      total: habits.length,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      label: "Active Streaks",
      value: activeHabits,
      total: habits.length,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      label: "Current Level",
      value: userProgress.level,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      icon: Trophy,
      label: "Total Streak Days",
      value: totalStreakDays,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-2`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-card-foreground">
                {stat.value}
                {stat.total !== undefined && (
                  <span className="text-sm text-muted-foreground font-normal">/{stat.total}</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
            {stat.total !== undefined && stat.value === stat.total && stat.total > 0 && (
              <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                Perfect!
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
