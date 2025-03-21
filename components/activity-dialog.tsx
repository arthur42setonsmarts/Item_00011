"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ActivityForm, type ActivityData } from "@/components/activity-form"
import { useActivitiesStore } from "@/lib/activities-store"

interface ActivityDialogProps {
  activity?: ActivityData
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (data: ActivityData) => void
}

export function ActivityDialog({ activity, isOpen, onOpenChange, onSave }: ActivityDialogProps) {
  const { updateActivity, addActivity } = useActivitiesStore()

  // Ensure date is a Date object
  const ensureDate = (date: Date | string | undefined): Date => {
    if (!date) return new Date()
    return date instanceof Date ? date : new Date(date)
  }

  // Ensure activity has a proper Date object
  const safeActivity = activity
    ? {
        ...activity,
        date: ensureDate(activity.date),
      }
    : undefined

  const handleSave = (data: ActivityData) => {
    if (activity?.id) {
      // Update existing activity
      updateActivity(activity.id, {
        type: data.type,
        plant: data.plant,
        date: ensureDate(data.date),
        notes: data.notes,
      })
    } else if (data) {
      // Add new activity
      addActivity({
        type: data.type,
        plant: data.plant,
        date: ensureDate(data.date),
        notes: data.notes,
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
        />
      </DialogContent>
    </Dialog>
  )
}

