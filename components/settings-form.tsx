"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSettingsStore } from "@/lib/settings-store"
import { useEffect } from "react"

const formSchema = z.object({
  gardenName: z.string().min(2, {
    message: "Garden name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  hardiness: z.string().optional(),
  temperatureUnit: z.enum(["F", "C"]),
  notifications: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  reminderTime: z.string().optional(),
})

export function SettingsForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { settings, updateSettings } = useSettingsStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  })

  // Update form when settings change
  useEffect(() => {
    form.reset(settings)
  }, [form, settings])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Update settings in the store
    updateSettings(values)

    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Settings updated",
        description: "Your garden settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Garden Information</h2>
          <Separator />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="gardenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garden Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>The name of your garden.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Your garden's location (city, state).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hardiness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hardiness Zone</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your hardiness zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1a">Zone 1a</SelectItem>
                      <SelectItem value="1b">Zone 1b</SelectItem>
                      <SelectItem value="2a">Zone 2a</SelectItem>
                      <SelectItem value="2b">Zone 2b</SelectItem>
                      <SelectItem value="3a">Zone 3a</SelectItem>
                      <SelectItem value="3b">Zone 3b</SelectItem>
                      <SelectItem value="4a">Zone 4a</SelectItem>
                      <SelectItem value="4b">Zone 4b</SelectItem>
                      <SelectItem value="5a">Zone 5a</SelectItem>
                      <SelectItem value="5b">Zone 5b</SelectItem>
                      <SelectItem value="6a">Zone 6a</SelectItem>
                      <SelectItem value="6b">Zone 6b</SelectItem>
                      <SelectItem value="7a">Zone 7a</SelectItem>
                      <SelectItem value="7b">Zone 7b</SelectItem>
                      <SelectItem value="8a">Zone 8a</SelectItem>
                      <SelectItem value="8b">Zone 8b</SelectItem>
                      <SelectItem value="9a">Zone 9a</SelectItem>
                      <SelectItem value="9b">Zone 9b</SelectItem>
                      <SelectItem value="10a">Zone 10a</SelectItem>
                      <SelectItem value="10b">Zone 10b</SelectItem>
                      <SelectItem value="11a">Zone 11a</SelectItem>
                      <SelectItem value="11b">Zone 11b</SelectItem>
                      <SelectItem value="12a">Zone 12a</SelectItem>
                      <SelectItem value="12b">Zone 12b</SelectItem>
                      <SelectItem value="13a">Zone 13a</SelectItem>
                      <SelectItem value="13b">Zone 13b</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Your USDA plant hardiness zone.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperatureUnit"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Temperature Unit</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-row space-x-4">
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="F" />
                        </FormControl>
                        <FormLabel className="font-normal">Fahrenheit (°F)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="C" />
                        </FormControl>
                        <FormLabel className="font-normal">Celsius (°C)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>Your preferred temperature unit for weather display.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <Separator />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Push Notifications</FormLabel>
                    <FormDescription>
                      Receive notifications for watering reminders and other garden tasks.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Notifications</FormLabel>
                    <FormDescription>Receive email notifications for important garden events.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reminderTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8:00 AM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (1:00 PM)</SelectItem>
                      <SelectItem value="evening">Evening (6:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>When you prefer to receive reminders.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

