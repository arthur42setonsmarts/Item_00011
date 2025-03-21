"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type Settings = {
  gardenName: string
  location: string
  hardiness: string
  temperatureUnit: "F" | "C"
  notifications: boolean
  emailNotifications: boolean
  reminderTime: string
}

type SettingsStore = {
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
}

// Default settings
const defaultSettings: Settings = {
  gardenName: "My Garden",
  location: "New York, NY",
  hardiness: "7b",
  temperatureUnit: "F",
  notifications: true,
  emailNotifications: true,
  reminderTime: "morning",
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: "garden-settings-storage",
    },
  ),
)

