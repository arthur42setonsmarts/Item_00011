"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useActivitiesStore } from "@/lib/activities-store"
import { usePlantStore } from "@/lib/store"

const formSchema = z.object({
  type: z.string({
    required_error: "Please select an activity type.",
  }),
  plant: z.string({
    required_error: "Please select a plant.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
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
}

export function ActivityForm({ activity, isEditing = false, onSave, onCancel, isDialog = false }: ActivityFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing && !activity)
  const { updateActivity, addActivity, getActivity } = useActivitiesStore()

  // Get plants from the store
  const plants = usePlantStore((state) => state.plants)

  // Ensure activity.date is a Date object
  const ensureDate = (date: Date | string | undefined): Date => {
    if (!date) return new Date()
    return date instanceof Date ? date : new Date(date)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: activity
      ? {
          type: activity.type,
          plant: activity.plant,
          date: ensureDate(activity.date),
          notes: activity.notes || "",
        }
      : {
          notes: "",
        },
  })

  useEffect(() => {
    if (isEditing && activity?.id && !activity.date) {
      setIsLoading(true)
      // Get activity data from the store
      const activityData = getActivity(activity.id)

      if (activityData) {
        form.reset({
          type: activityData.type,
          plant: activityData.plant,
          date: ensureDate(activityData.date),
          notes: activityData.notes || "",
        })
      }

      setIsLoading(false)
    }
  }, [isEditing, activity, form, getActivity])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Create the activity data object
    const activityData: ActivityData = {
      id: activity?.id,
      ...values,
      // Ensure date is a Date object
      date: ensureDate(values.date),
    }

    if (isEditing && activity?.id) {
      // Update existing activity
      updateActivity(activity.id, {
        ...values,
        // Ensure date is a Date object
        date: ensureDate(values.date),
      })
      console.log("Updating activity:", activityData)
    } else {
      // Add new activity
      addActivity({
        ...values,
        // Ensure date is a Date object
        date: ensureDate(values.date),
      })
      console.log("Creating activity:", activityData)
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
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
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

