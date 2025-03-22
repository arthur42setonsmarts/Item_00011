"use client"

import type React from "react"

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
import { MoreHorizontal, Pencil, Trash2, X, Calendar, Flower2, Undo2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useActivitiesStore, type Activity } from "@/lib/activities-store"
import { usePlantStore } from "@/lib/store"
import { ActivityDialog } from "@/components/activity-dialog"
import type { ActivityData } from "@/components/activity-form"
import { Card, CardContent } from "@/components/ui/card"

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
  // Add state for storing deleted activity for undo functionality
  const [deletedActivity, setDeletedActivity] = useState<Activity | null>(null)
  // Add state for storing the index of the deleted activity
  const [deletedActivityIndex, setDeletedActivityIndex] = useState<number>(-1)
  // Use a ref to track deletion IDs that have been undone
  const undoneActionsRef = useRef<Set<string>>(new Set())

  const activities = useActivitiesStore((state) => state.activities)
  const plants = usePlantStore((state) => state.plants)
  const { deleteActivity, getActivity } = useActivitiesStore()
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
    // Find the activity and its index before deletion
    const activityIndex = activities.findIndex((a) => a.id === id)
    const activityToDelete = getActivity(id)

    if (activityToDelete && activityIndex !== -1) {
      setDeletedActivity({ ...activityToDelete })
      setDeletedActivityIndex(activityIndex)
    }

    // Open the confirmation dialog and set the activity to delete
    setActivityToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (activityToDelete) {
      // Generate a unique deletion ID
      const deletionId = `activity-${activityToDelete}-${Date.now()}`

      deleteActivity(activityToDelete)

      // Show success toast with undo button
      if (deletedActivity) {
        toast({
          title: "Activity deleted",
          description: "The activity has been successfully removed.",
          action: (
            <Button variant="outline" size="sm" onClick={() => handleUndoDelete(deletionId)} className="gap-1">
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </Button>
          ),
        })
      } else {
        toast({
          title: "Activity deleted",
          description: "The activity has been successfully removed.",
        })
      }

      setActivityToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  // Handle undo delete functionality
  const handleUndoDelete = (deletionId: string) => {
    // Check if this deletion has already been undone
    if (undoneActionsRef.current.has(deletionId)) {
      return // Already undone, do nothing
    }

    if (deletedActivity && deletedActivityIndex >= 0) {
      // Add the activity back to the store at the original index
      useActivitiesStore.getState().addActivityAtIndex(deletedActivity, deletedActivityIndex)

      toast({
        title: "Deletion undone",
        description: "The activity has been restored to its original position.",
      })

      // Mark this deletion as undone
      undoneActionsRef.current.add(deletionId)
    }
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

  // Get activity icon color class
  const getActivityColorClass = (type: string) => {
    switch (type) {
      case "watering":
        return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300"
      case "planting":
        return "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300"
      case "harvesting":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300"
      case "pruning":
        return "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300"
      case "fertilizing":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300"
      default:
        return "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  // Get activity badge class
  const getActivityBadgeClass = (type: string) => {
    switch (type) {
      case "watering":
        return "border-blue-500 text-blue-500"
      case "planting":
        return "border-green-500 text-green-500"
      case "harvesting":
        return "border-amber-500 text-amber-500"
      case "pruning":
        return "border-purple-500 text-purple-500"
      case "fertilizing":
        return "border-emerald-500 text-emerald-500"
      default:
        return "border-gray-500 text-gray-500"
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative sm:max-w-xs w-full">
            <Input
              placeholder="Search activities..."
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

        {activities.length === 0 ? (
          <div className="rounded-md border p-8 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <p>No activities available in your garden.</p>
              <p className="text-sm">Add your first activity to track your gardening tasks.</p>
              <Button className="mt-4" asChild>
                <Link href="/activities/add">Add Activity</Link>
              </Button>
            </div>
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredActivities.map((activity) => {
              const plant = plants.find((p) => p.id === activity.plant)
              const plantName = plant ? plant.name : "Unknown Plant"

              return (
                <Card key={activity.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className={cn("p-2 border-b", getActivityColorClass(activity.type))}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className={cn("text-xs px-1.5 py-0", getActivityBadgeClass(activity.type))}
                          >
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </Badge>
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
                      </div>
                    </div>

                    <div className="p-2 space-y-2">
                      <div className="flex items-center text-xs">
                        <Flower2 className="h-3 w-3 mr-1 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate">{plantName}</span>
                      </div>

                      <div className="flex items-center text-xs">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{new Date(activity.date).toLocaleDateString()}</span>
                      </div>

                      {activity.notes && (
                        <div className="pt-1 border-t">
                          <p className="text-xs text-muted-foreground line-clamp-2">{activity.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="border-t p-2 flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleEditActivity(activity)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive"
                        onClick={() => handleDeleteActivity(activity.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="rounded-md border p-8 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <p>No activities found matching your search.</p>
              <p className="text-sm">Try adjusting your search term or filter.</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
                <Button variant="outline" onClick={() => setFilterType("all")}>
                  Clear Filter
                </Button>
              </div>
            </div>
          </div>
        )}

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

// Add a Link component since we're using it
function Link({
  href,
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
}

