"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreVertical, Edit, Trash2 } from "lucide-react"
import type { Habit } from "@/lib/types"

interface HabitCardProps {
  habit: Habit
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

export function HabitCard({ habit, onEdit, onDelete }: HabitCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    onDelete(habit.id)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <Card className="relative group hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{habit.emoji}</span>
              <div>
                <h3 className="font-semibold text-card-foreground">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(habit.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(habit)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Habit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Habit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{habit.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{habit.longestStreak}</p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{habit.totalCompletions}</p>
              <p className="text-xs text-muted-foreground">Total Days</p>
            </div>
          </div>

          {/* Progress bar for current streak */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to next milestone</span>
              <span>{habit.currentStreak}/7 days</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((habit.currentStreak / 7) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{habit.name}"? This action cannot be undone and you'll lose all progress
              for this habit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Habit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
