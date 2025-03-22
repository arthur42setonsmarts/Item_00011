"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ActivityForm, type ActivityData } from "@/components/activity-form"
import { useActivitiesStore, type Activity } from "@/lib/activities-store"
// Import the useToast hook at the top of the file
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Undo2 } from "lucide-react"

interface ActivityDialogProps {
  activity?: ActivityData
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (data: ActivityData) => void
}

export function ActivityDialog({ activity, isOpen, onOpenChange, onSave }: ActivityDialogProps) {
  const { updateActivity, addActivity, getActivity } = useActivitiesStore()
  // Add the toast hook
  const { toast } = useToast()
  // Add state for previous activity
  const [previousActivity, setPreviousActivity] = useState<Activity | null>(null)

  // Safe function to convert any date value to a proper Date object
  const safeDate = (value: any): Date => {
    if (!value) return new Date()
    if (value instanceof Date) return isNaN(value.getTime()) ? new Date() : value

    try {
      const date = new Date(value)
      return isNaN(date.getTime()) ? new Date() : date
    } catch (e) {
      return new Date()
    }
  }

  // Ensure activity has a proper Date object
  const safeActivity = activity
    ? {
        ...activity,
        date: safeDate(activity.date),
      }
    : undefined

  const handleSave = (data: ActivityData) => {
    if (activity?.id) {
      // Store the previous state for undo
      const originalActivity = getActivity(activity.id)
      if (originalActivity) {
        setPreviousActivity({ ...originalActivity })
      }

      // Update existing activity
      updateActivity(activity.id, {
        type: data.type,
        plant: data.plant,
        date: data.date,
        notes: data.notes,
      })

      // Show success toast for update with undo button
      toast({
        title: "Activity updated",
        description: "Your activity has been successfully updated.",
        action: originalActivity ? (
          <Button variant="outline" size="sm" onClick={handleUndo} className="gap-1">
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </Button>
        ) : undefined,
      })
    } else if (data) {
      // Add new activity
      addActivity({
        type: data.type,
        plant: data.plant,
        date: data.date,
        notes: data.notes,
      })

      // Show success toast for creation
      toast({
        title: "Activity added",
        description: "Your new activity has been successfully added.",
      })
    }

    if (onSave) {
      onSave(data)
    }
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  // Handle undo functionality
  const handleUndo = () => {
    if (previousActivity && activity?.id) {
      // Restore the previous activity state
      updateActivity(activity.id, previousActivity)

      toast({
        title: "Changes reverted",
        description: "Your activity has been restored to its previous state.",
      })
    }
  }

  const title = activity?.id ? "Edit Activity" : "Add Activity"
  const description = activity?.id
    ? "Update the details of this gardening activity."
    : "Add a new gardening activity to your schedule."

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ActivityForm
          activity={safeActivity}
          isEditing={!!activity?.id}
          onSave={handleSave}
          onCancel={handleCancel}
          isDialog={true}
          onUndo={handleUndo}
        />
      </DialogContent>
    </Dialog>
  )
}

