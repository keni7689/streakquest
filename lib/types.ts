export interface Habit {
  id: string
  name: string
  emoji: string
  createdAt: string
  completions: string[] // Array of completion dates (YYYY-MM-DD format)
  currentStreak: number
  longestStreak: number
  totalCompletions: number
}

export interface UserProgress {
  totalXP: number
  level: number
  xpToNextLevel: number
  unlockedMilestones: Milestone[]
}

export interface Milestone {
  id: string
  name: string
  description: string
  requiredDays: number
  reward: string
  emoji: string
  unlockedAt?: string
}

export interface GameStats {
  habits: Habit[]
  userProgress: UserProgress
  lastUpdated: string
}

export const MILESTONES: Milestone[] = [
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Complete a habit for 7 consecutive days",
    requiredDays: 7,
    reward: "+50 XP Bonus",
    emoji: "🔥",
  },
  {
    id: "fortnight-fighter",
    name: "Fortnight Fighter",
    description: "Maintain a 14-day streak",
    requiredDays: 14,
    reward: "+100 XP Bonus",
    emoji: "⚡",
  },
  {
    id: "monthly-master",
    name: "Monthly Master",
    description: "Achieve a 30-day streak",
    requiredDays: 30,
    reward: "+200 XP Bonus",
    emoji: "🏆",
  },
  {
    id: "diamond-dedication",
    name: "Diamond Dedication",
    description: "Reach a 60-day streak",
    requiredDays: 60,
    reward: "+400 XP Bonus",
    emoji: "💎",
  },
  {
    id: "legendary-legend",
    name: "Legendary Legend",
    description: "Achieve a 90-day streak",
    requiredDays: 90,
    reward: "+800 XP Bonus",
    emoji: "👑",
  },
]

export const XP_PER_COMPLETION = 10
export const XP_PER_LEVEL = 25
