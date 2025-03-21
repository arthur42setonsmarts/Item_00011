"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, SproutIcon as Seedling, CropIcon as Harvest, Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ActivityDialog } from "@/components/activity-dialog"
import type { ActivityData } from "@/components/activity-form"
import { useActivitiesStore } from "@/lib/activities-store"
import { usePlantStore } from "@/lib/store"

export function UpcomingActivities() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | undefined>(undefined)

  const allActivities = useActivitiesStore((state) => state.activities)
  const plants = usePlantStore((state) => state.plants)

  // Filter for upcoming activities (today and future)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const activities = allActivities
    .filter((activity) => new Date(activity.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4) // Limit to 4 activities

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "watering":
        return <Droplets className="h-4 w-4" />
      case "planting":
        return <Seedling className="h-4 w-4" />
      case "harvesting":
        return <Harvest className="h-4 w-4" />
      case "pruning":
        return <Flower2 className="h-4 w-4" />
      default:
        return <Droplets className="h-4 w-4" />
    }
  }

  const getDisplayDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const activityDate = new Date(date)
    activityDate.setHours(0, 0, 0, 0)

    if (activityDate.getTime() === today.getTime()) {
      return "Today"
    } else if (activityDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow"
    } else {
      const diffDays = Math.round((activityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return `In ${diffDays} days`
    }
  }

  // Ensure date is a Date object
  const ensureDate = (date: Date | string): Date => {
    return date instanceof Date ? date : new Date(date)
  }

  const handleActivityClick = (activity: (typeof activities)[0]) => {
    setSelectedActivity({
      id: activity.id,
      type: activity.type,
      plant: activity.plant,
      date: ensureDate(activity.date),
      notes: activity.notes,
    })
    setIsDialogOpen(true)
  }

  const handleSaveActivity = (data: ActivityData) => {
    console.log("Saving activity:", data)
    // The actual saving is handled in the ActivityDialog component
    setIsDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Activities</CardTitle>
          <CardDescription>Your scheduled gardening tasks for the next few days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24">
                <p className="text-muted-foreground">No upcoming activities scheduled</p>
                <p className="text-sm text-muted-foreground">Add activities to see them here</p>
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => {
                const plant = plants.find((p) => p.id === activity.plant)
                const plantName = plant ? plant.name : "Unknown Plant"

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          activity.type === "watering" &&
                            "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
                          activity.type === "planting" &&
                            "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
                          activity.type === "harvesting" &&
                            "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
                          activity.type === "pruning" &&
                            "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
                          activity.type === "fertilizing" &&
                            "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300",
                        )}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className="font-medium">{plantName}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{getDisplayDate(ensureDate(activity.date))}</Badge>
                  </div>
                )
              })
            ) : (
              <div className="flex items-center justify-center h-24">
                <p className="text-muted-foreground">No upcoming activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ActivityDialog
        activity={selectedActivity}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveActivity}
      />
    </>
  )
}

