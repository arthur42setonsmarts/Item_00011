"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, SproutIcon as Seedling, CropIcon as Harvest, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlantActivitiesProps {
  plantId: string
}

export function PlantActivities({ plantId }: PlantActivitiesProps) {
  // In a real app, you would fetch this data from an API
  const activities = [
    {
      id: 1,
      type: "watering",
      date: "2023-06-01",
      notes: "Thoroughly watered after a hot day",
      icon: <Droplets className="h-4 w-4" />,
    },
    {
      id: 2,
      type: "pruning",
      date: "2023-05-25",
      notes: "Removed suckers and lower leaves",
      icon: <Seedling className="h-4 w-4" />,
    },
    {
      id: 3,
      type: "watering",
      date: "2023-05-28",
      notes: "Light watering",
      icon: <Droplets className="h-4 w-4" />,
    },
    {
      id: 4,
      type: "harvesting",
      date: "2023-05-20",
      notes: "Harvested first ripe tomato",
      icon: <Harvest className="h-4 w-4" />,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Activity History</h3>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "mt-1 flex h-8 w-8 items-center justify-center rounded-full",
                    activity.type === "watering" && "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
                    activity.type === "pruning" && "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
                    activity.type === "harvesting" &&
                      "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
                  )}
                >
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{activity.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

