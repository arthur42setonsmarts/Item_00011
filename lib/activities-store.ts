"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ActivityType = "watering" | "planting" | "harvesting" | "pruning" | "fertilizing"

export type Activity = {
  id: string
  type: ActivityType
  plant: string
  date: Date
  notes?: string
}

type ActivitiesStore = {
  activities: Activity[]
  getActivity: (id: string) => Activity | undefined
  updateActivity: (id: string, data: Partial<Activity>) => void
  addActivity: (activity: Omit<Activity, "id">) => void
  addActivityWithId: (activity: Activity) => void
  addActivityAtIndex: (activity: Activity, index: number) => void
  deleteActivity: (id: string) => void
}

// Ensure date is a Date object
const ensureDate = (date: Date | string): Date => {
  return date instanceof Date ? date : new Date(date)
}

// Initial activities data
const initialActivities: Activity[] = [
  {
    id: "1",
    type: "watering",
    plant: "1", // Tomato ID
    date: new Date(),
    notes: "Regular watering schedule",
  },
  {
    id: "2",
    type: "planting",
    plant: "2", // Basil ID
    date: new Date(Date.now() + 86400000), // Tomorrow
    notes: "Plant new basil seedlings",
  },
  {
    id: "3",
    type: "harvesting",
    plant: "4", // Lettuce ID
    date: new Date(Date.now() + 2 * 86400000), // In 2 days
    notes: "Harvest outer leaves",
  },
  {
    id: "4",
    type: "watering",
    plant: "3", // Cucumber ID
    date: new Date(Date.now() + 3 * 86400000), // In 3 days
    notes: "Deep watering",
  },
  {
    id: "5",
    type: "watering",
    plant: "3", // Pepper ID
    date: new Date(Date.now() - 86400000), // Yesterday
    notes: "Light watering",
  },
  {
    id: "6",
    type: "harvesting",
    plant: "5", // Strawberry ID
    date: new Date(Date.now() - 2 * 86400000), // 2 days ago
    notes: "Harvested ripe berries",
  },
  {
    id: "7",
    type: "planting",
    plant: "1", // Carrot ID
    date: new Date(Date.now() - 3 * 86400000), // 3 days ago
    notes: "Planted new seeds",
  },
]

export const useActivitiesStore = create<ActivitiesStore>()(
  persist(
    (set, get) => ({
      activities: initialActivities,
      getActivity: (id) => get().activities.find((activity) => activity.id === id),
      updateActivity: (id, data) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id
              ? {
                  ...activity,
                  ...data,
                  // Ensure date is a Date object if it's being updated
                  ...(data.date ? { date: ensureDate(data.date) } : {}),
                }
              : activity,
          ),
        })),
      addActivity: (activity) =>
        set((state) => ({
          activities: [
            ...state.activities,
            {
              ...activity,
              id: (state.activities.length + 1).toString(),
              // Ensure date is a Date object
              date: ensureDate(activity.date),
            },
          ],
        })),
      addActivityWithId: (activity) =>
        set((state) => ({
          activities: [
            ...state.activities,
            {
              ...activity,
              // Ensure date is a Date object
              date: ensureDate(activity.date),
            },
          ],
        })),
      addActivityAtIndex: (activity, index) =>
        set((state) => {
          const newActivities = [...state.activities]
          // Ensure index is within bounds
          const safeIndex = Math.min(Math.max(0, index), newActivities.length)
          newActivities.splice(safeIndex, 0, {
            ...activity,
            // Ensure date is a Date object
            date: ensureDate(activity.date),
          })
          return { activities: newActivities }
        }),
      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
        })),
    }),
    {
      name: "garden-activities-storage",
      // Convert Date objects to strings when storing and back to Date when retrieving
      serialize: (state) => {
        const serializedState = JSON.stringify(state, (key, value) => {
          if (key === "date" && value instanceof Date) {
            return value.toISOString()
          }
          return value
        })
        return serializedState
      },
      deserialize: (str) => {
        const state = JSON.parse(str, (key, value) => {
          if (key === "date" && typeof value === "string") {
            return new Date(value)
          }
          return value
        })
        return state
      },
    },
  ),
)

