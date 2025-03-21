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

export function ActivitiesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | undefined>(undefined)

  const activities = useActivitiesStore((state) => state.activities)
  const plants = usePlantStore((state) => state.plants)
  const { deleteActivity } = useActivitiesStore()

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
    if (confirm("Are you sure you want to delete this activity?")) {
      deleteActivity(id)
    }
  }

  const handleSaveActivity = (data: ActivityData) => {
    console.log("Saving activity:", data)
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
              {filteredActivities.map((activity) => {
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
              })}
            </TableBody>
          </Table>
        </div>
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

