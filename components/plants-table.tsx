"use client"

import { useState, useRef } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye, X, Calendar, MapPin, Undo2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import type { Plant } from "@/lib/types"

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

export function PlantsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const plants = usePlantStore((state) => state.plants)
  const deletePlant = usePlantStore((state) => state.deletePlant)
  const router = useRouter()
  // Add toast hook
  const { toast } = useToast()
  // Add state for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [plantToDelete, setPlantToDelete] = useState<string | null>(null)
  // Add state for storing deleted plant for undo functionality
  const [deletedPlant, setDeletedPlant] = useState<Plant | null>(null)
  // Add state for storing the index of the deleted plant
  const [deletedPlantIndex, setDeletedPlantIndex] = useState<number>(-1)
  // Use a ref to track deletion IDs that have been undone
  const undoneActionsRef = useRef<Set<string>>(new Set())

  const filteredPlants = plants.filter(
    (plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeletePlant = (id: string) => {
    // Find the plant and its index before deletion
    const plantIndex = plants.findIndex((p) => p.id === id)
    const plantToDelete = usePlantStore.getState().getPlant(id)

    if (plantToDelete && plantIndex !== -1) {
      setDeletedPlant({ ...plantToDelete })
      setDeletedPlantIndex(plantIndex)
    }

    // Open the confirmation dialog and set the plant to delete
    setPlantToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (plantToDelete) {
      // Generate a unique deletion ID
      const deletionId = `plant-${plantToDelete}-${Date.now()}`

      deletePlant(plantToDelete)

      // Show success toast with undo button
      if (deletedPlant) {
        toast({
          title: "Plant deleted",
          description: "The plant has been successfully removed.",
          action: (
            <Button variant="outline" size="sm" onClick={() => handleUndoDelete(deletionId)} className="gap-1">
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </Button>
          ),
        })
      } else {
        toast({
          title: "Plant deleted",
          description: "The plant has been successfully removed.",
        })
      }

      setPlantToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  // Handle undo delete functionality
  const handleUndoDelete = (deletionId: string) => {
    // Check if this deletion has already been undone
    if (undoneActionsRef.current.has(deletionId)) {
      return // Already undone, do nothing
    }

    if (deletedPlant && deletedPlantIndex >= 0) {
      // Add the plant back to the store at the original index
      usePlantStore.getState().addPlantAtIndex(deletedPlant, deletedPlantIndex)

      toast({
        title: "Deletion undone",
        description: `${deletedPlant.name} has been restored to its original position.`,
      })

      // Mark this deletion as undone
      undoneActionsRef.current.add(deletionId)
    }
  }

  // Function to format location string
  const formatLocation = (location: string) => {
    return location.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative max-w-sm w-full">
          <Input
            placeholder="Search plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-8"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <p>No plants available in your garden.</p>
            <p className="text-sm">Add your first plant to get started.</p>
            <Button className="mt-4" asChild>
              <Link href="/plants/add">Add Plant</Link>
            </Button>
          </div>
        </div>
      ) : filteredPlants.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filteredPlants.map((plant) => (
            <Card key={plant.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-3 border-b">
                  <div className="flex justify-between items-start">
                    <div className="truncate pr-2">
                      <h3 className="font-medium text-sm truncate">{plant.name}</h3>
                      {plant.variety && <p className="text-xs text-muted-foreground truncate">{plant.variety}</p>}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2 -mt-1 h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/plants/${plant.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/plants/${plant.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePlant(plant.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex items-center text-xs">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{formatLocation(plant.location)}</span>
                  </div>

                  <div className="flex items-center text-xs">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">Planted: {new Date(plant.plantedDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-1.5 py-0",
                        plant.status === "growing" && "border-green-500 text-green-500",
                        plant.status === "harvested" && "border-amber-500 text-amber-500",
                        plant.status === "dormant" && "border-gray-500 text-gray-500",
                      )}
                    >
                      {plant.status.charAt(0).toUpperCase() + plant.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="border-t p-2 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => router.push(`/plants/${plant.id}`)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                    <Link href={`/plants/${plant.id}/edit`}>
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-destructive"
                    onClick={() => handleDeletePlant(plant.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border p-8 text-center">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <p>No plants found matching your search.</p>
            <p className="text-sm">Try adjusting your search term.</p>
            <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        </div>
      )}

      {/* Add the AlertDialog for delete confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the plant and all associated data.
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

