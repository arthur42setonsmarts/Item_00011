"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, SproutIcon as Seedling, CropIcon as Harvest, Flower2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { ActivityDialog } from "@/components/activity-dialog"
import type { ActivityData } from "@/components/activity-form"
import { useActivitiesStore } from "@/lib/activities-store"
import { usePlantStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function RecentActivities() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | undefined>(undefined)

  const allActivities = useActivitiesStore((state) => state.activities)
  const plants = usePlantStore((state) => state.plants)
  const addActivity = useActivitiesStore((state) => state.addActivity)

  // Filter for recent activities (past)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const activities = allActivities
    .filter((activity) => new Date(activity.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
    .slice(0, 3) // Limit to 3 activities

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

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const activityDate = new Date(date)
    activityDate.setHours(0, 0, 0, 0)

    if (activityDate.getTime() === yesterday.getTime()) {
      return "Yesterday"
    } else {
      const diffDays = Math.round((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
      return `${diffDays} days ago`
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
    // If it's a new activity, add it
    if (!data.id) {
      addActivity({
        type: data.type,
        plant: data.plant,
        date: data.date,
        notes: data.notes || "",
      })
    }
    // If it's an existing activity, the dialog will handle the update
    setIsDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your recently completed gardening tasks</CardDescription>
          </div>
          {plants.length > 0 && (
            <Link href="/activities/add">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24">
                {plants.length > 0 ? (
                  <>
                    <p className="text-muted-foreground">No recent activities recorded</p>
                    <p className="text-sm text-muted-foreground">Complete activities to see them here</p>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground">Add plants to get started</p>
                    <Link href="/plants/add" className="mt-2">
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Plant
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            ) : (
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

