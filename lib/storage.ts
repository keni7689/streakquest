import type { GameStats } from "./types"

const STORAGE_KEY = "streakquest-data"

export function getStoredData(): GameStats {
  if (typeof window === "undefined") {
    return getDefaultGameStats()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return getDefaultGameStats()
    }

    const parsed = JSON.parse(stored)
    return {
      ...getDefaultGameStats(),
      ...parsed,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error loading stored data:", error)
    return getDefaultGameStats()
  }
}

export function saveData(data: GameStats): void {
  if (typeof window === "undefined") return

  try {
    const dataToSave = {
      ...data,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  } catch (error) {
    console.error("Error saving data:", error)
  }
}

export function getDefaultGameStats(): GameStats {
  return {
    habits: [],
    userProgress: {
      totalXP: 0,
      level: 1,
      xpToNextLevel: 25,
      unlockedMilestones: [],
    },
    lastUpdated: new Date().toISOString(),
  }
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0]
}

export function calculateStreak(completions: string[]): { current: number; longest: number } {
  if (completions.length === 0) {
    return { current: 0, longest: 0 }
  }

  const sortedDates = completions.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  const today = getTodayString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  // Calculate current streak
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    let expectedDate = sortedDates[0] === today ? today : yesterday

    for (const date of sortedDates) {
      if (date === expectedDate) {
        currentStreak++
        const prevDate = new Date(new Date(expectedDate).getTime() - 24 * 60 * 60 * 1000)
        expectedDate = prevDate.toISOString().split("T")[0]
      } else {
        break
      }
    }
  }

  // Calculate longest streak
  for (let i = 0; i < sortedDates.length; i++) {
    tempStreak = 1
    let currentDate = new Date(sortedDates[i])

    for (let j = i + 1; j < sortedDates.length; j++) {
      const nextDate = new Date(sortedDates[j])
      const dayDiff = (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)

      if (dayDiff === 1) {
        tempStreak++
        currentDate = nextDate
      } else {
        break
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak)
  }

  return { current: currentStreak, longest: longestStreak }
}
