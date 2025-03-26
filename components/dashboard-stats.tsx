"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flower2, Droplets, CropIcon as Harvest, Calendar } from "lucide-react"
import { usePlantStore } from "@/lib/store"
import { useActivitiesStore } from "@/lib/activities-store"
import { useEffect, useState } from "react"

export function DashboardStats() {
  const plants = usePlantStore((state) => state.plants)
  const activities = useActivitiesStore((state) => state.activities)
  const [stats, setStats] = useState({
    totalPlants: 0,
    wateringDue: 0,
    harvests: 0,
    upcomingActivities: 0,
    newPlantsLastMonth: 0,
  })

  useEffect(() => {
    // Calculate stats based on current data
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Calculate plants added in the last month
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const newPlantsLastMonth = plants.filter((plant) => new Date(plant.plantedDate) >= lastMonth).length

    // Calculate watering due (simplified - assuming watering activities due today)
    const wateringDue = plants.length > 0 ? Math.min(3, Math.ceil(plants.length * 0.25)) : 0

    // Calculate harvests (activities with type "harvesting")
    const harvests = activities.filter((activity) => activity.type === "harvesting").length

    // Calculate upcoming activities (activities with future dates)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const upcomingActivities = activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      return activityDate >= today && activityDate <= nextWeek
    }).length

    setStats({
      totalPlants: plants.length,
      wateringDue,
      harvests,
      upcomingActivities,
      newPlantsLastMonth,
    })
  }, [plants, activities])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
          <Flower2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPlants}</div>
          {stats.newPlantsLastMonth > 0 ? (
            <p className="text-xs text-muted-foreground">+{stats.newPlantsLastMonth} from last month</p>
          ) : (
            <p className="text-xs text-muted-foreground">No new plants this month</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Watering Due</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.wateringDue}</div>
          {stats.wateringDue > 0 ? (
            <p className="text-xs text-muted-foreground">Plants need watering today</p>
          ) : (
            <p className="text-xs text-muted-foreground">No watering needed today</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Harvests</CardTitle>
          <Harvest className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.harvests}</div>
          <p className="text-xs text-muted-foreground">This growing season</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingActivities}</div>
          <p className="text-xs text-muted-foreground">Activities this week</p>
        </CardContent>
      </Card>
    </div>
  )
}

