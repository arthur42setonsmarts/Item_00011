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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useActivitiesStore } from "@/lib/activities-store"
import { usePlantStore } from "@/lib/store"
import { ActivityDialog } from "@/components/activity-dialog"
import type { ActivityData } from "@/components/activity-form"

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

export function ActivitiesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | undefined>(undefined)
  // Add state for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null)

  const activities = useActivitiesStore((state) => state.activities)
  const plants = usePlantStore((state) => state.plants)
  const { deleteActivity } = useActivitiesStore()
  // Add toast hook
  const { toast } = useToast()

  const filteredActivities = activities.filter((activity) => {
    const plant = plants.find((p) => p.id === activity.plant)
    const plantName = plant ? plant.name : "Unknown Plant"

    return (
      (plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.notes && activity.notes.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (filterType === "all" || activity.type === filterType)
    )
  })

  const handleEditActivity = (activity: (typeof activities)[0]) => {
    setSelectedActivity({
      id: activity.id,
      type: activity.type,
      plant: activity.plant,
      date: activity.date,
      notes: activity.notes,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteActivity = (id: string) => {
    // Open the confirmation dialog and set the activity to delete
    setActivityToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (activityToDelete) {
      deleteActivity(activityToDelete)
      // Show success toast
      toast({
        title: "Activity deleted",
        description: "The activity has been successfully removed.",
      })
      setActivityToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  const handleSaveActivity = (data: ActivityData) => {
    console.log("Saving activity:", data)
    // Show success toast
    toast({
      title: "Activity updated",
      description: "Your activity has been successfully updated.",
    })
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="sm:max-w-xs">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="watering">Watering</SelectItem>
              <SelectItem value="planting">Planting</SelectItem>
              <SelectItem value="harvesting">Harvesting</SelectItem>
              <SelectItem value="pruning">Pruning</SelectItem>
              <SelectItem value="fertilizing">Fertilizing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Plant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p>No activities available in your garden.</p>
                      <p className="text-sm">Add your first activity to track your gardening tasks.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => {
                  const plant = plants.find((p) => p.id === activity.plant)
                  const plantName = plant ? plant.name : "Unknown Plant"

                  return (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            activity.type === "watering" && "border-blue-500 text-blue-500",
                            activity.type === "planting" && "border-green-500 text-green-500",
                            activity.type === "harvesting" && "border-amber-500 text-amber-500",
                            activity.type === "pruning" && "border-purple-500 text-purple-500",
                            activity.type === "fertilizing" && "border-emerald-500 text-emerald-500",
                          )}
                        >
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{plantName}</TableCell>
                      <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs truncate">{activity.notes}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditActivity(activity)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteActivity(activity.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p>No activities found matching your search.</p>
                      <p className="text-sm">Try adjusting your search term or filter.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Rest of the component remains the same */}

        {/* Add the AlertDialog for delete confirmation */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this activity.
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

      <ActivityDialog
        activity={selectedActivity}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveActivity}
      />
    </>
  )
}

