"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useActivitiesStore, type Activity } from "@/lib/activities-store"
import { usePlantStore } from "@/lib/store"
import { DatePickerNew } from "@/components/date-picker-new"
import { useToast } from "@/hooks/use-toast"
import { Undo2 } from "lucide-react"

// Simplified schema with more lenient date handling
const formSchema = z.object({
  type: z.string({
    required_error: "Please select an activity type.",
  }),
  plant: z.string({
    required_error: "Please select a plant.",
  }),
  // Make date optional in the schema, we'll handle validation manually
  date: z.any().optional(),
  notes: z.string().optional(),
})

export interface ActivityData {
  id?: string
  type: string
  plant: string
  date: Date
  notes?: string
}

interface ActivityFormProps {
  activity?: ActivityData
  isEditing?: boolean
  onSave?: (data: ActivityData) => void
  onCancel?: () => void
  isDialog?: boolean
  onUndo?: () => void
}

export function ActivityForm({
  activity,
  isEditing = false,
  onSave,
  onCancel,
  isDialog = false,
  onUndo,
}: ActivityFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { updateActivity, addActivity, getActivity } = useActivitiesStore()
  const { toast } = useToast()
  const [previousActivity, setPreviousActivity] = useState<Activity | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Get plants from the store
  const plants = usePlantStore((state) => state.plants)

  // Safe function to convert any date value to a proper Date object
  const safeDate = (value: any): Date | undefined => {
    if (!value) return undefined
    if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value

    try {
      const date = new Date(value)
      return isNaN(date.getTime()) ? undefined : date
    } catch (e) {
      return undefined
    }
  }

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: activity?.type || "",
      plant: activity?.plant || "",
      notes: activity?.notes || "",
      // Don't set date in defaultValues, we'll handle it separately
    },
    mode: "onSubmit",
  })

  // Set up the date separately from the form
  useEffect(() => {
    if (activity?.date) {
      const date = safeDate(activity.date)
      setSelectedDate(date)
    }
  }, [activity])

  // Load activity data when editing
  useEffect(() => {
    if (isEditing && activity?.id) {
      setIsLoading(true)

      // Get activity data from the store
      const activityData = getActivity(activity.id)

      if (activityData) {
        // Store the original activity for undo functionality
        setPreviousActivity({ ...activityData })

        // Set form values
        form.reset({
          type: activityData.type,
          plant: activityData.plant,
          notes: activityData.notes || "",
        })

        // Set date separately
        const date = safeDate(activityData.date)
        setSelectedDate(date)
      }

      setIsLoading(false)
    }
  }, [isEditing, activity, form, getActivity])

  // Handle undo functionality
  const handleUndo = () => {
    if (previousActivity && activity?.id) {
      // Restore the previous activity state
      updateActivity(activity.id, previousActivity)

      toast({
        title: "Changes reverted",
        description: "Your activity has been restored to its previous state.",
      })

      if (onUndo) {
        onUndo()
      }
    }
  }

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Validate date manually
    if (!selectedDate) {
      form.setError("date", {
        type: "manual",
        message: "Please select a date.",
      })
      return
    }

    setIsSubmitting(true)

    // Create the activity data object with the separately managed date
    const activityData: ActivityData = {
      id: activity?.id,
      type: values.type,
      plant: values.plant,
      date: selectedDate,
      notes: values.notes,
    }

    if (isEditing && activity?.id) {
      // Update existing activity
      updateActivity(activity.id, {
        type: values.type,
        plant: values.plant,
        date: selectedDate,
        notes: values.notes,
      })

      // Show toast with undo button if not in dialog mode
      if (!isDialog) {
        toast({
          title: "Activity updated",
          description: "Your activity has been successfully updated.",
          action: previousActivity ? (
            <Button variant="outline" size="sm" onClick={handleUndo} className="gap-1">
              <Undo2 className="h-3.5 w-3.5" />
              Undo
            </Button>
          ) : undefined,
        })
      }
    } else {
      // Add new activity
      addActivity({
        type: values.type,
        plant: values.plant,
        date: selectedDate,
        notes: values.notes,
      })

      // Show success toast if not in dialog mode
      if (!isDialog) {
        toast({
          title: "Activity added",
          description: "Your new activity has been successfully added.",
        })
      }
    }

    setTimeout(() => {
      setIsSubmitting(false)

      if (onSave) {
        onSave(activityData)
      } else {
        router.push("/activities")
      }
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading activity data...</p>
        </div>
      </div>
    )
  }

  const buttonText = isEditing
    ? isSubmitting
      ? "Updating..."
      : "Update Activity"
    : isSubmitting
      ? "Saving..."
      : "Save Activity"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an activity type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="watering">Watering</SelectItem>
                    <SelectItem value="planting">Planting</SelectItem>
                    <SelectItem value="harvesting">Harvesting</SelectItem>
                    <SelectItem value="pruning">Pruning</SelectItem>
                    <SelectItem value="fertilizing">Fertilizing</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The type of gardening activity you performed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plant</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        {plant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The plant this activity is for.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePickerNew
                    date={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      // Clear any errors when a date is selected
                      if (date) {
                        form.clearErrors("date")
                      }
                    }}
                    placeholder="Pick a date"
                  />
                </FormControl>
                <FormDescription>When you performed this activity.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any notes about this activity..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>Any additional information about this activity.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel || (() => router.push("/activities"))}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  )
}

