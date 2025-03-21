"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Droplets, SproutIcon as Seedling, CropIcon as Harvest, Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"

// In a real app, you would fetch this data from an API
const activities = [
  {
    id: 1,
    type: "watering",
    plant: "Tomato",
    date: new Date(2023, 5, 1), // June 1, 2023
    icon: <Droplets className="h-4 w-4" />,
  },
  {
    id: 2,
    type: "planting",
    plant: "Basil",
    date: new Date(2023, 4, 1), // May 1, 2023
    icon: <Seedling className="h-4 w-4" />,
  },
  {
    id: 3,
    type: "harvesting",
    plant: "Lettuce",
    date: new Date(2023, 4, 28), // May 28, 2023
    icon: <Harvest className="h-4 w-4" />,
  },
  {
    id: 4,
    type: "pruning",
    plant: "Tomato",
    date: new Date(2023, 4, 25), // May 25, 2023
    icon: <Flower2 className="h-4 w-4" />,
  },
  {
    id: 5,
    type: "watering",
    plant: "Cucumber",
    date: new Date(2023, 4, 20), // May 20, 2023
    icon: <Droplets className="h-4 w-4" />,
  },
]

export function ActivitiesCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Group activities by date
  const activitiesByDate = activities.reduce(
    (acc, activity) => {
      const dateStr = activity.date.toDateString()
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(activity)
      return acc
    },
    {} as Record<string, typeof activities>,
  )

  // Get activities for the selected date
  const selectedDateActivities = date ? activitiesByDate[date.toDateString()] || [] : []

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>View your gardening activities by date</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              booked: Object.keys(activitiesByDate).map((dateStr) => new Date(dateStr)),
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                backgroundColor: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {date
              ? date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
              : "Select a date"}
          </CardTitle>
          <CardDescription>Activities for this date</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateActivities.length > 0 ? (
            <div className="space-y-4">
              {selectedDateActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      activity.type === "watering" && "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
                      activity.type === "planting" &&
                        "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
                      activity.type === "harvesting" &&
                        "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
                      activity.type === "pruning" &&
                        "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
                    )}
                  >
                    {activity.icon}
                  </div>
                  <div>
                    <p className="font-medium">{activity.plant}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">No activities for this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

