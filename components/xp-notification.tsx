"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Zap, TrendingUp, Trophy, Star } from "lucide-react"
import type { Milestone } from "@/lib/types"
import type { StreakMilestone } from "@/lib/game-logic"

interface XPNotificationProps {
  xpGained: number
  leveledUp: boolean
  newLevel?: number
  newMilestones: Milestone[]
  streakMilestones: StreakMilestone[]
  onClose: () => void
}

export function XPNotification({
  xpGained,
  leveledUp,
  newLevel,
  newMilestones,
  streakMilestones,
  onClose,
}: XPNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (xpGained > 0 || leveledUp || newMilestones.length > 0 || streakMilestones.length > 0) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [xpGained, leveledUp, newMilestones, streakMilestones, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 animate-in slide-in-from-right duration-300">
      {/* XP Gain Notification */}
      {xpGained > 0 && (
        <Card className="p-4 bg-accent/10 border-accent/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/20 rounded-full">
              <Zap className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="font-medium text-card-foreground">+{xpGained} XP Gained!</p>
              <p className="text-sm text-muted-foreground">Keep up the great work!</p>
            </div>
          </div>
        </Card>
      )}

      {/* Level Up Notification */}
      {leveledUp && (
        <Card className="p-4 bg-primary/10 border-primary/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-card-foreground">Level Up!</p>
              <p className="text-sm text-muted-foreground">You're now Level {newLevel}!</p>
            </div>
          </div>
        </Card>
      )}

      {/* Streak Milestone Notifications */}
      {streakMilestones.map((milestone, index) => (
        <Card key={index} className="p-4 bg-chart-2/10 border-chart-2/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-chart-2/20 rounded-full">
              <Star className="h-4 w-4 text-chart-2" />
            </div>
            <div>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                {milestone.emoji} {milestone.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {milestone.days} day streak! +{milestone.xpBonus} bonus XP
              </p>
            </div>
          </div>
        </Card>
      ))}

      {/* New Achievement Notifications */}
      {newMilestones.map((milestone, index) => (
        <Card key={index} className="p-4 bg-chart-3/10 border-chart-3/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-chart-3/20 rounded-full">
              <Trophy className="h-4 w-4 text-chart-3" />
            </div>
            <div>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                {milestone.emoji} {milestone.name}
              </p>
              <p className="text-sm text-muted-foreground">{milestone.reward}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
