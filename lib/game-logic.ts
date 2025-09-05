import {
  type Habit,
  type UserProgress,
  type Milestone,
  MILESTONES,
  XP_PER_COMPLETION,
  XP_PER_LEVEL,
  type GameStats,
} from "./types"
import { calculateStreak } from "./storage"

export interface XPGainEvent {
  type: "completion" | "milestone" | "level_up"
  amount: number
  source: string
  timestamp: string
}

export interface StreakMilestone {
  days: number
  title: string
  emoji: string
  xpBonus: number
}

export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 3, title: "Getting Started", emoji: "🌱", xpBonus: 5 },
  { days: 7, title: "Week Warrior", emoji: "🔥", xpBonus: 15 },
  { days: 14, title: "Fortnight Fighter", emoji: "⚡", xpBonus: 30 },
  { days: 21, title: "Three Week Champion", emoji: "💪", xpBonus: 50 },
  { days: 30, title: "Monthly Master", emoji: "🏆", xpBonus: 100 },
  { days: 60, title: "Diamond Dedication", emoji: "💎", xpBonus: 200 },
  { days: 90, title: "Legendary Legend", emoji: "👑", xpBonus: 400 },
  { days: 180, title: "Half Year Hero", emoji: "🌟", xpBonus: 800 },
  { days: 365, title: "Year Long Yogi", emoji: "🎯", xpBonus: 1600 },
]

export function calculateXPAndLevel(habits: Habit[]): UserProgress {
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0)
  const baseXP = totalCompletions * XP_PER_COMPLETION

  // Calculate milestone bonuses
  const unlockedMilestones: Milestone[] = []
  let bonusXP = 0

  habits.forEach((habit) => {
    MILESTONES.forEach((milestone) => {
      if (habit.longestStreak >= milestone.requiredDays) {
        const existingMilestone = unlockedMilestones.find((m) => m.id === `${milestone.id}-${habit.id}`)

        if (!existingMilestone) {
          unlockedMilestones.push({
            ...milestone,
            id: `${milestone.id}-${habit.id}`,
            unlockedAt: new Date().toISOString(),
          })

          // Add bonus XP based on milestone
          const bonusAmount = Number.parseInt(milestone.reward.match(/\d+/)?.[0] || "0")
          bonusXP += bonusAmount
        }
      }
    })
  })

  const totalXP = baseXP + bonusXP
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1
  const xpToNextLevel = XP_PER_LEVEL - (totalXP % XP_PER_LEVEL)

  return {
    totalXP,
    level,
    xpToNextLevel,
    unlockedMilestones,
  }
}

export function updateHabitCompletion(habit: Habit, date: string, completed: boolean): Habit {
  const completions = completed
    ? [...habit.completions.filter((d) => d !== date), date]
    : habit.completions.filter((d) => d !== date)

  const streaks = calculateStreak(completions)

  return {
    ...habit,
    completions,
    currentStreak: streaks.current,
    longestStreak: Math.max(habit.longestStreak, streaks.longest),
    totalCompletions: completions.length,
  }
}

export function createNewHabit(name: string, emoji: string): Habit {
  return {
    id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    emoji,
    createdAt: new Date().toISOString(),
    completions: [],
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0,
  }
}

export function calculateXPGain(
  oldStats: GameStats,
  newStats: GameStats,
): {
  xpGained: number
  leveledUp: boolean
  newMilestones: Milestone[]
  streakMilestones: StreakMilestone[]
} {
  const xpGained = newStats.userProgress.totalXP - oldStats.userProgress.totalXP
  const leveledUp = newStats.userProgress.level > oldStats.userProgress.level

  // Find new milestones
  const oldMilestoneIds = new Set(oldStats.userProgress.unlockedMilestones.map((m) => m.id))
  const newMilestones = newStats.userProgress.unlockedMilestones.filter((m) => !oldMilestoneIds.has(m.id))

  // Find streak milestones achieved
  const streakMilestones: StreakMilestone[] = []
  newStats.habits.forEach((habit) => {
    const oldHabit = oldStats.habits.find((h) => h.id === habit.id)
    if (oldHabit && habit.currentStreak > oldHabit.currentStreak) {
      const milestone = STREAK_MILESTONES.find((m) => m.days === habit.currentStreak)
      if (milestone) {
        streakMilestones.push(milestone)
      }
    }
  })

  return { xpGained, leveledUp, newMilestones, streakMilestones }
}

export function getNextStreakMilestone(currentStreak: number): StreakMilestone | null {
  return STREAK_MILESTONES.find((milestone) => milestone.days > currentStreak) || null
}

export function isStreakAtRisk(habit: Habit): boolean {
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const completedToday = habit.completions.includes(today)
  const completedYesterday = habit.completions.includes(yesterday)

  return !completedToday && !completedYesterday && habit.currentStreak > 0
}
