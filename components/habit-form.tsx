"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Habit } from "@/lib/types"

interface HabitFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, emoji: string) => void
  habit?: Habit
  title: string
  description: string
}

const EMOJI_OPTIONS = [
  "💪",
  "🏃",
  "📚",
  "🧘",
  "💧",
  "🥗",
  "😴",
  "🚫",
  "🎯",
  "✍️",
  "🎵",
  "🎨",
  "🧠",
  "💻",
  "📱",
  "🏠",
  "🌱",
  "⚡",
  "🔥",
  "🌟",
  "🎮",
  "📖",
  "🏋️",
  "🚶",
  "🧘‍♀️",
  "🍎",
  "☕",
  "🌅",
  "🌙",
  "💝",
]

export function HabitForm({ isOpen, onClose, onSubmit, habit, title, description }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || "")
  const [selectedEmoji, setSelectedEmoji] = useState(habit?.emoji || "🎯")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      onSubmit(name.trim(), selectedEmoji)
      setName("")
      setSelectedEmoji("🎯")
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setName(habit?.name || "")
    setSelectedEmoji(habit?.emoji || "🎯")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Exercise, Read, Meditate"
              maxLength={50}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Choose an Emoji</Label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`
                    p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110
                    ${
                      selectedEmoji === emoji
                        ? "border-primary bg-primary/10 scale-105"
                        : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? "Saving..." : habit ? "Update Habit" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
