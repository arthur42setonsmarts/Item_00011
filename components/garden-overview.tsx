"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { usePlantStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function GardenOverview() {
  const plants = usePlantStore((state) => state.plants)
  const [gardenBeds, setGardenBeds] = useState<
    {
      id: string
      name: string
      capacity: number
      plants: string[]
    }[]
  >([])

  useEffect(() => {
    // Group plants by location
    const locationGroups: Record<string, string[]> = {}

    plants.forEach((plant) => {
      if (!locationGroups[plant.location]) {
        locationGroups[plant.location] = []
      }
      locationGroups[plant.location].push(plant.name)
    })

    // Convert to garden beds format
    const beds = Object.entries(locationGroups).map(([location, plantNames], index) => {
      // Format location name
      const formattedLocation = location
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      // Calculate a capacity percentage (more plants = higher capacity)
      const capacity = Math.min(95, Math.max(20, plantNames.length * 15))

      return {
        id: (index + 1).toString(),
        name: formattedLocation,
        capacity,
        plants: plantNames,
      }
    })

    setGardenBeds(beds)
  }, [plants])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Garden Overview</CardTitle>
        <CardDescription>Status of your garden beds and spaces</CardDescription>
      </CardHeader>
      <CardContent>
        {gardenBeds.length > 0 ? (
          <div className="space-y-4">
            {gardenBeds.map((bed) => (
              <div key={bed.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{bed.name}</p>
                    <p className="text-xs text-muted-foreground">{bed.plants.join(", ")}</p>
                  </div>
                  <span className="text-sm font-medium">{bed.capacity}%</span>
                </div>
                <Progress value={bed.capacity} className="h-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground mb-2">No plants in your garden yet</p>
            <Link href="/plants/add">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Plant
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

