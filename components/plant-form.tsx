"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
// Import the store at the top of the file
import { usePlantStore, type Plant } from "@/lib/store"
// Import the new DatePicker component
import { DatePickerNew } from "@/components/date-picker-new"
// Import toast
import { useToast } from "@/hooks/use-toast"
import { Undo2 } from "lucide-react"

// Modified schema to make plantedDate optional when editing
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Plant name must be at least 2 characters.",
  }),
  variety: z.string().optional(),
  location: z.string({
    required_error: "Please select a garden location.",
  }),
  plantedDate: z.date().optional(),
  notes: z.string().optional(),
})

interface PlantFormProps {
  plantId?: string
  isEditing?: boolean
}

export function PlantForm({ plantId, isEditing = false }: PlantFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [previousPlant, setPreviousPlant] = useState<Plant | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      variety: "",
      location: "",
      notes: "",
      // Don't set a default plantedDate to avoid validation on initial render
    },
    mode: "onSubmit", // Only validate on submit
  })

  // Update the useEffect to load data from the store
  useEffect(() => {
    if (isEditing && plantId) {
      setIsLoading(true)

      // Get plant data from the store
      const plant = usePlantStore.getState().getPlant(plantId)

      if (plant) {
        // Store the original plant for undo functionality
        setPreviousPlant({ ...plant })

        form.reset({
          name: plant.name,
          variety: plant.variety,
          location: plant.location,
          plantedDate: plant.plantedDate instanceof Date ? plant.plantedDate : new Date(plant.plantedDate),
          notes: plant.notes || "",
        })
      }

      setIsLoading(false)
    }
  }, [isEditing, plantId, form])

  // Handle undo functionality
  const handleUndo = () => {
    if (previousPlant && plantId) {
      // Restore the previous plant state
      usePlantStore.getState().updatePlant(plantId, previousPlant)

      toast({
        title: "Changes reverted",
        description: "Your plant has been restored to its previous state.",
      })
    }
  }

  // Update the onSubmit function to use the store
  function onSubmit(values: z.infer<typeof formSchema>) {
    // When editing, don't require plantedDate if we're just updating other fields
    if (!isEditing && !values.plantedDate) {
      form.setError("plantedDate", {
        type: "manual",
        message: "Please select a planting date.",
      })
      return
    }

    setIsSubmitting(true)

    if (isEditing && plantId) {
      // For editing, only include plantedDate in the update if it was changed
      const updateData: Partial<Plant> = {
        name: values.name,
        variety: values.variety,
        location: values.location,
        notes: values.notes,
      }

      // Only include plantedDate if it exists
      if (values.plantedDate) {
        updateData.plantedDate = values.plantedDate instanceof Date ? values.plantedDate : new Date(values.plantedDate)
      }

      // Update existing plant
      usePlantStore.getState().updatePlant(plantId, updateData)
      console.log("Updating plant:", values)

      // Show toast with undo button
      toast({
        title: "Plant updated",
        description: "Your plant has been successfully updated.",
        action: previousPlant ? (
          <Button variant="outline" size="sm" onClick={handleUndo} className="gap-1">
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </Button>
        ) : undefined,
      })
    } else {
      // For new plants, require a plantedDate
      if (!values.plantedDate) {
        form.setError("plantedDate", {
          type: "manual",
          message: "Please select a planting date.",
        })
        return
      }

      // Add new plant
      usePlantStore.getState().addPlant({
        ...values,
        // Ensure plantedDate is a Date object
        plantedDate: values.plantedDate instanceof Date ? values.plantedDate : new Date(values.plantedDate),
      })
      console.log("Creating plant:", values)

      // Show success toast
      toast({
        title: "Plant added",
        description: "Your new plant has been successfully added.",
      })
    }

    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/plants")
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading plant data...</p>
        </div>
      </div>
    )
  }

  const buttonText = isEditing
    ? isSubmitting
      ? "Updating..."
      : "Update Plant"
    : isSubmitting
      ? "Saving..."
      : "Save Plant"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plant Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tomato"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>The common name of your plant.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="variety"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variety</FormLabel>
                <FormControl>
                  <Input placeholder="Roma" {...field} />
                </FormControl>
                <FormDescription>The specific variety of your plant (optional).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garden Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vegetable-bed">Vegetable Bed</SelectItem>
                    <SelectItem value="herb-garden">Herb Garden</SelectItem>
                    <SelectItem value="flower-bed">Flower Bed</SelectItem>
                    <SelectItem value="container">Container</SelectItem>
                    <SelectItem value="greenhouse">Greenhouse</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Where your plant is located in your garden.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plantedDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Planting Date</FormLabel>
                <FormControl>
                  <DatePickerNew
                    date={field.value}
                    onSelect={(date) => {
                      field.onChange(date)
                      // Clear any errors when a date is selected
                      if (date) {
                        form.clearErrors("plantedDate")
                      }
                    }}
                    placeholder="Pick a date"
                  />
                </FormControl>
                <FormDescription>When you planted or will plant this plant.</FormDescription>
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
                <Textarea placeholder="Add any notes about this plant..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>Any additional information about your plant.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.push("/plants")}>
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

