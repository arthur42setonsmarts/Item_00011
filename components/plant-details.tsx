"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Droplets, SproutIcon as Seedling, CropIcon as Harvest } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Import the store at the top of the file
import { usePlantStore } from "@/lib/store"

interface PlantDetailsProps {
  id: string
}

// Update the component to use the store
export function PlantDetails({ id }: PlantDetailsProps) {
  // Get plant data from the store
  const plant = usePlantStore((state) => state.getPlant(id)) || {
    id,
    name: "Unknown Plant",
    variety: "",
    location: "Unknown",
    plantedDate: new Date(),
    status: "growing" as const,
    notes: "No information available.",
    wateringFrequency: "Unknown",
    sunExposure: "Unknown",
    soilType: "Unknown",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{plant.name}</h1>
          <p className="text-muted-foreground">{plant.variety}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/plants/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={cn(
                    plant.status === "growing" && "border-green-500 text-green-500",
                    plant.status === "harvested" && "border-amber-500 text-amber-500",
                    plant.status === "dormant" && "border-gray-500 text-gray-500",
                  )}
                >
                  {plant.status.charAt(0).toUpperCase() + plant.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Location</span>
                <span>{plant.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Planted Date</span>
                <span>{new Date(plant.plantedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Watering</span>
                <span>{plant.wateringFrequency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Sun Exposure</span>
                <span>{plant.sunExposure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Soil Type</span>
                <span>{plant.soilType}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Quick Actions</span>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Droplets className="mr-2 h-4 w-4" />
                  Water
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Seedling className="mr-2 h-4 w-4" />
                  Prune
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Harvest className="mr-2 h-4 w-4" />
                  Harvest
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-2 font-medium">Notes</h3>
          <p className="text-sm text-muted-foreground">{plant.notes}</p>
        </CardContent>
      </Card>
    </div>
  )
}

