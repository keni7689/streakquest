"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, BarChart3 } from "lucide-react"
import type { GameStats, Habit } from "@/lib/types"
import { getStoredData, saveData, getTodayString } from "@/lib/storage"
import { calculateXPAndLevel, createNewHabit, updateHabitCompletion, calculateXPGain } from "@/lib/game-logic"
import { HabitForm } from "@/components/habit-form"
import { HabitCard } from "@/components/habit-card"
import { DailyChecklist } from "@/components/daily-checklist"
import { QuickStats } from "@/components/quick-stats"
import { XPNotification } from "@/components/xp-notification"
import { StreakProgress } from "@/components/streak-progress"

export default function StreakQuestApp() {
  const [gameStats, setGameStats] = useState<GameStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [activeTab, setActiveTab] = useState("today")
  const [notification, setNotification] = useState<{
    xpGained: number
    leveledUp: boolean
    newLevel?: number
    newMilestones: any[]
    streakMilestones: any[]
  } | null>(null)

  useEffect(() => {
    const loadData = () => {
      const data = getStoredData()
      // Recalculate user progress to ensure consistency
      data.userProgress = calculateXPAndLevel(data.habits)
      setGameStats(data)
      setIsLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    if (gameStats) {
      saveData(gameStats)
    }
  }, [gameStats])

  const updateGameStats = (oldStats: GameStats, newStats: GameStats) => {
    const gains = calculateXPGain(oldStats, newStats)

    if (gains.xpGained > 0 || gains.leveledUp || gains.newMilestones.length > 0 || gains.streakMilestones.length > 0) {
      setNotification({
        xpGained: gains.xpGained,
        leveledUp: gains.leveledUp,
        newLevel: gains.leveledUp ? newStats.userProgress.level : undefined,
        newMilestones: gains.newMilestones,
        streakMilestones: gains.streakMilestones,
      })
    }

    setGameStats(newStats)
  }

  const handleAddHabit = (name: string, emoji: string) => {
    if (!gameStats) return

    const newHabit = createNewHabit(name, emoji)
    const updatedHabits = [...gameStats.habits, newHabit]
    const updatedStats = {
      ...gameStats,
      habits: updatedHabits,
      userProgress: calculateXPAndLevel(updatedHabits),
    }

    updateGameStats(gameStats, updatedStats)
  }

  const handleEditHabit = (name: string, emoji: string) => {
    if (!gameStats || !editingHabit) return

    const updatedHabits = gameStats.habits.map((habit) =>
      habit.id === editingHabit.id ? { ...habit, name, emoji } : habit,
    )

    const updatedStats = {
      ...gameStats,
      habits: updatedHabits,
      userProgress: calculateXPAndLevel(updatedHabits),
    }

    updateGameStats(gameStats, updatedStats)
    setEditingHabit(null)
  }

  const handleDeleteHabit = (habitId: string) => {
    if (!gameStats) return

    const updatedHabits = gameStats.habits.filter((habit) => habit.id !== habitId)
    const updatedStats = {
      ...gameStats,
      habits: updatedHabits,
      userProgress: calculateXPAndLevel(updatedHabits),
    }

    updateGameStats(gameStats, updatedStats)
  }

  const handleToggleCompletion = (habitId: string, completed: boolean) => {
    if (!gameStats) return

    const today = getTodayString()
    const updatedHabits = gameStats.habits.map((habit) =>
      habit.id === habitId ? updateHabitCompletion(habit, today, completed) : habit,
    )

    const updatedStats = {
      ...gameStats,
      habits: updatedHabits,
      userProgress: calculateXPAndLevel(updatedHabits),
    }

    updateGameStats(gameStats, updatedStats)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading StreakQuest...</p>
        </div>
      </div>
    )
  }

  if (!gameStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load game data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🎮 StreakQuest</h1>
          <p className="text-muted-foreground">
            Level up your habits, unlock achievements, and build unstoppable streaks!
          </p>
        </header>

        {/* Player Stats Card */}
        <div className="bg-card rounded-lg p-6 border shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-card-foreground">Level {gameStats.userProgress.level} Player</h2>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total XP</p>
              <p className="text-xl font-bold text-primary">{gameStats.userProgress.totalXP}</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {gameStats.userProgress.level + 1}</span>
              <span className="text-muted-foreground">{25 - gameStats.userProgress.xpToNextLevel}/25 XP</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className="bg-accent h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${((25 - gameStats.userProgress.xpToNextLevel) / 25) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="today" className="gap-2">
                <Calendar className="h-4 w-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="habits" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                All Habits
              </TabsTrigger>
            </TabsList>

            <Button onClick={() => setShowAddHabit(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Habit
            </Button>
          </div>

          <TabsContent value="today" className="space-y-6">
            {/* Quick Stats */}
            <QuickStats habits={gameStats.habits} userProgress={gameStats.userProgress} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Daily Checklist */}
                <DailyChecklist habits={gameStats.habits} onToggleCompletion={handleToggleCompletion} />
              </div>
              <div>
                {/* Streak Progress */}
                <StreakProgress habits={gameStats.habits} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            {/* Habits Management Section */}
            <div className="bg-card rounded-lg p-6 border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">Your Habits ({gameStats.habits.length})</h3>
              </div>

              {gameStats.habits.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h4 className="text-lg font-medium text-card-foreground mb-2">No habits yet!</h4>
                  <p className="text-muted-foreground mb-6">
                    Start your journey by adding your first habit. Every expert was once a beginner!
                  </p>
                  <Button onClick={() => setShowAddHabit(true)} size="lg" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Habit
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gameStats.habits.map((habit) => (
                    <HabitCard key={habit.id} habit={habit} onEdit={setEditingHabit} onDelete={handleDeleteHabit} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Milestones */}
        {gameStats.userProgress.unlockedMilestones.length > 0 && (
          <div className="bg-card rounded-lg p-6 border shadow-sm mt-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">🏆 Unlocked Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gameStats.userProgress.unlockedMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20"
                >
                  <span className="text-2xl">{milestone.emoji}</span>
                  <div>
                    <h4 className="font-medium text-card-foreground">{milestone.name}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Habit Dialog */}
        <HabitForm
          isOpen={showAddHabit}
          onClose={() => setShowAddHabit(false)}
          onSubmit={handleAddHabit}
          title="Add New Habit"
          description="Create a new habit to track and build streaks with."
        />

        {/* Edit Habit Dialog */}
        <HabitForm
          isOpen={!!editingHabit}
          onClose={() => setEditingHabit(null)}
          onSubmit={handleEditHabit}
          habit={editingHabit || undefined}
          title="Edit Habit"
          description="Update your habit name and emoji."
        />

        {/* XP and Achievement Notifications */}
        {notification && <XPNotification {...notification} onClose={() => setNotification(null)} />}
      </div>
    </div>
  )
}
