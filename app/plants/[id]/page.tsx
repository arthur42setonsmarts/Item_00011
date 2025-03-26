"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePlantStore } from "@/lib/store"
import { useActivitiesStore } from "@/lib/activities-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pencil,
  Trash2,
  Droplets,
  SproutIcon as Seedling,
  CropIcon as Harvest,
  Calendar,
  Sun,
  Shovel,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { cn, formatDate } from "@/lib/utils"
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
import { ActivityDialog } from "@/components/activity-dialog"
import type { ActivityData } from "@/components/activity-form"

export default function PlantPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | undefined>(undefined)
  const [plant, setPlant] = useState<any>(null) // Initialize plant state

  // Get plant and activities data
  const { getPlant, deletePlant } = usePlantStore()
  const { activities, addActivity } = useActivitiesStore()

  // If the ID is "add", this is not a plant detail page
  if (params.id === "add") {
    return null // This will never render because /plants/add has its own page
  }

  // Get the plant data
  // const plant = getPlant(params.id) // No longer directly assigning here

  // Get plant activities
  const plantActivities = activities
    .filter((activity) => activity.plant === params.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Handle loading state
  useEffect(() => {
    let isMounted = true // Add a flag to track component mount status

    setIsLoading(true) // Ensure loading is set to true at the start

    const fetchPlant = async () => {
      if (params.id !== "add") {
        const fetchedPlant = getPlant(params.id)

        if (!fetchedPlant) {
          toast({
            title: "Plant not found",
            description: "The plant you're looking for doesn't exist.",
            variant: "destructive",
          })

          // Redirect after a short delay
          setTimeout(() => {
            router.push("/plants")
          }, 1000)
        }

        if (isMounted) {
          setPlant(fetchedPlant) // Set the plant state
        }
      }
    }

    fetchPlant()

    setIsLoading(false) // Set loading to false after attempting to fetch

    return () => {
      isMounted = false // Set the flag to false when the component unmounts
    }
  }, [params.id, getPlant, router, toast])

  // Handle plant not found
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading plant details...</p>
        </div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold">Plant Not Found</h2>
        <p className="mt-2 text-muted-foreground">The plant you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6" onClick={() => router.push("/plants")}>
          Return to Plants
        </Button>
      </div>
    )
  }

  // Handle delete plant
  const handleDeletePlant = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    deletePlant(params.id)
    toast({
      title: "Plant deleted",
      description: `${plant.name} has been successfully removed.`,
    })
    router.push("/plants")
  }

  // Handle add activity
  const handleAddActivity = (type = "watering") => {
    setSelectedActivity({
      type: type,
      plant: params.id,
      date: new Date(),
    })
    setIsActivityDialogOpen(true)
  }

  const handleActivitySave = (data: ActivityData) => {
    // Now we need to save the activity here since we've prevented the dialog from doing it
    addActivity({
      type: data.type,
      plant: data.plant,
      date: data.date,
      notes: data.notes || "",
    })

    toast({
      title: "Activity added",
      description: `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} activity has been added.`,
    })
    setIsActivityDialogOpen(false)
  }

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "watering":
        return <Droplets className="h-4 w-4" />
      case "planting":
        return <Seedling className="h-4 w-4" />
      case "harvesting":
        return <Harvest className="h-4 w-4" />
      case "pruning":
        return <Seedling className="h-4 w-4" />
      case "fertilizing":
        return <Shovel className="h-4 w-4" />
      default:
        return <Droplets className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Plant header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{plant.name}</h1>
          {plant.variety && <p className="text-muted-foreground">{plant.variety}</p>}
          <div className="flex items-center mt-2">
            <Badge
              variant="outline"
              className={cn(
                "mr-2",
                plant.status === "growing" && "border-green-500 text-green-500",
                plant.status === "harvested" && "border-amber-500 text-amber-500",
                plant.status === "dormant" && "border-gray-500 text-gray-500",
              )}
            >
              {plant.status.charAt(0).toUpperCase() + plant.status.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">Planted on {formatDate(new Date(plant.plantedDate))}</span>
          </div>
        </div>
        <div className="flex gap-2 self-start sm:self-center">
          <Link href={`/plants/${params.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="text-destructive" onClick={handleDeletePlant}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Plant details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Location</dt>
                <dd>{plant.location.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Planted Date</dt>
                <dd>{formatDate(new Date(plant.plantedDate))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-muted-foreground">Status</dt>
                <dd
                  className={cn(
                    plant.status === "growing" && "text-green-500",
                    plant.status === "harvested" && "text-amber-500",
                    plant.status === "dormant" && "text-gray-500",
                  )}
                >
                  {plant.status.charAt(0).toUpperCase() + plant.status.slice(1)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Care Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between items-center">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Droplets className="mr-2 h-4 w-4" />
                  Watering
                </dt>
                <dd>{plant.wateringFrequency || "Not specified"}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Sun className="mr-2 h-4 w-4" />
                  Sun Exposure
                </dt>
                <dd>{plant.sunExposure || "Not specified"}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="font-medium text-muted-foreground flex items-center">
                  <Shovel className="mr-2 h-4 w-4" />
                  Soil Type
                </dt>
                <dd>{plant.soilType || "Not specified"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => handleAddActivity("watering")}>
                <Droplets className="mr-2 h-4 w-4" />
                Log Watering
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleAddActivity("pruning")}>
                <Seedling className="mr-2 h-4 w-4" />
                Log Pruning
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAddActivity("harvesting")}
              >
                <Harvest className="mr-2 h-4 w-4" />
                Log Harvest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {plant.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{plant.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs for activities, etc. */}
      <Tabs defaultValue="activities" className="mt-6">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Activity History</h3>
            <Button size="sm" onClick={() => handleAddActivity()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>

          {plantActivities.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                <h3 className="text-lg font-medium">No Activities Yet</h3>
                <p className="text-muted-foreground mt-1">Start tracking your gardening activities for this plant.</p>
                <Button className="mt-4" onClick={() => handleAddActivity()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Activity
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {plantActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-start">
                      <div
                        className={cn(
                          "p-4 h-full flex items-center justify-center",
                          activity.type === "watering" &&
                            "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
                          activity.type === "planting" &&
                            "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300",
                          activity.type === "harvesting" &&
                            "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300",
                          activity.type === "pruning" &&
                            "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300",
                          activity.type === "fertilizing" &&
                            "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300",
                        )}
                      >
                        <div className="h-10 w-10 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </h4>
                          <span className="text-sm text-muted-foreground">{formatDate(new Date(activity.date))}</span>
                        </div>
                        {activity.notes && <p className="mt-1 text-sm text-muted-foreground">{activity.notes}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gallery" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium">Plant Gallery</h3>
              <p className="text-muted-foreground mt-1">Track your plant's growth with photos. Coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium">Growth Statistics</h3>
              <p className="text-muted-foreground mt-1">Visualize your plant's progress over time. Coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation dialog */}
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

      {/* Activity dialog */}
      <ActivityDialog
        activity={selectedActivity}
        isOpen={isActivityDialogOpen}
        onOpenChange={setIsActivityDialogOpen}
        onSave={handleActivitySave}
      />
    </div>
  )
}

