"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Initial plant data
const initialPlants = [
  {
    id: "1",
    name: "Tomato",
    variety: "Roma",
    location: "vegetable-bed",
    plantedDate: new Date("2023-04-15"),
    notes: "Growing well, needs regular watering during hot days.",
    status: "growing",
  },
  {
    id: "2",
    name: "Basil",
    variety: "Sweet",
    location: "herb-garden",
    plantedDate: new Date("2023-05-01"),
    notes: "Thriving in partial shade.",
    status: "growing",
  },
  {
    id: "3",
    name: "Cucumber",
    variety: "English",
    location: "vegetable-bed",
    plantedDate: new Date("2023-04-20"),
    notes: "Climbing well on trellis.",
    status: "growing",
  },
  {
    id: "4",
    name: "Lettuce",
    variety: "Romaine",
    location: "vegetable-bed",
    plantedDate: new Date("2023-03-10"),
    notes: "Ready for harvest.",
    status: "harvested",
  },
  {
    id: "5",
    name: "Sunflower",
    variety: "Mammoth",
    location: "flower-bed",
    plantedDate: new Date("2023-05-15"),
    notes: "Growing tall and strong.",
    status: "growing",
  },
]

export type Plant = {
  id: string
  name: string
  variety: string
  location: string
  plantedDate: Date
  notes: string
  status: "growing" | "harvested" | "dormant"
}

type PlantStore = {
  plants: Plant[]
  getPlant: (id: string) => Plant | undefined
  updatePlant: (id: string, data: Partial<Plant>) => void
  addPlant: (plant: Omit<Plant, "id" | "status">) => void
  addPlantWithId: (plant: Plant) => void
  addPlantAtIndex: (plant: Plant, index: number) => void
  deletePlant: (id: string) => void
}

export const usePlantStore = create<PlantStore>()(
  persist(
    (set, get) => ({
      plants: initialPlants,
      getPlant: (id: string) => {
        // Ensure id is a string and do a strict comparison
        const stringId = String(id)
        return get().plants.find((plant) => String(plant.id) === stringId)
      },
      updatePlant: (id, data) =>
        set((state) => ({
          plants: state.plants.map((plant) => (plant.id === id ? { ...plant, ...data } : plant)),
        })),
      addPlant: (plant) =>
        set((state) => ({
          plants: [
            ...state.plants,
            {
              ...plant,
              id: (state.plants.length + 1).toString(),
              status: "growing",
            },
          ],
        })),
      addPlantWithId: (plant) =>
        set((state) => ({
          plants: [...state.plants, { ...plant }],
        })),
      addPlantAtIndex: (plant, index) =>
        set((state) => {
          const newPlants = [...state.plants]
          // Ensure index is within bounds
          const safeIndex = Math.min(Math.max(0, index), newPlants.length)
          newPlants.splice(safeIndex, 0, plant)
          return { plants: newPlants }
        }),
      deletePlant: (id) =>
        set((state) => ({
          plants: state.plants.filter((plant) => plant.id !== id),
        })),
    }),
    {
      name: "garden-plants-storage",
      // Convert Date objects to strings when storing and back to Date when retrieving
      serialize: (state) => {
        const serializedState = JSON.stringify(state, (key, value) => {
          if (key === "plantedDate" && value instanceof Date) {
            return value.toISOString()
          }
          return value
        })
        return serializedState
      },
      deserialize: (str) => {
        const state = JSON.parse(str, (key, value) => {
          if (key === "plantedDate" && typeof value === "string") {
            return new Date(value)
          }
          return value
        })
        return state
      },
    },
  ),
)

