"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
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

  const filteredPlants = plants.filter(
    (plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeletePlant = (id: string) => {
    // Open the confirmation dialog and set the plant to delete
    setPlantToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (plantToDelete) {
      deletePlant(plantToDelete)
      // Show success toast
      toast({
        title: "Plant deleted",
        description: "The plant has been successfully removed.",
      })
      setPlantToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search plants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Variety</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Planted Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No plants available in your garden.</p>
                    <p className="text-sm">Add your first plant to get started.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <TableRow key={plant.id}>
                  <TableCell className="font-medium">{plant.name}</TableCell>
                  <TableCell>{plant.variety}</TableCell>
                  <TableCell>{plant.location}</TableCell>
                  <TableCell>{new Date(plant.plantedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/plants/${plant.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No plants found matching your search.</p>
                    <p className="text-sm">Try adjusting your search term.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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

