"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Droplets, SproutIcon as Seedling, CropIcon as Harvest } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

// Import the store at the top of the file
import { usePlantStore } from "@/lib/store"

// Import the useToast hook and AlertDialog components at the top of the file
import { useToast } from "@/hooks/use-toast"
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
import { useState } from "react"

interface PlantDetailsProps {
  id: string
}

// Update the component to use the store
export function PlantDetails({ id }: PlantDetailsProps) {
  const router = useRouter()
  // Get plant data and deletePlant function from the store
  const { getPlant, deletePlant } = usePlantStore((state) => ({
    getPlant: state.getPlant,
    deletePlant: state.deletePlant,
  }))
  // Add toast hook
  const { toast } = useToast()
  // Add state for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const plant = getPlant(id) || {
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

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    deletePlant(id)
    toast({
      title: "Plant deleted",
      description: "The plant has been successfully removed.",
    })
    router.push("/plants")
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
          <Button variant="outline" size="sm" className="text-destructive" onClick={handleDelete}>
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
      {/* Add the AlertDialog for delete confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {plant.name} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

