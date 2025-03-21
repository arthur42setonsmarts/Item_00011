"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, CloudRain, Thermometer } from "lucide-react"
import { useSettingsStore } from "@/lib/settings-store"
import { convertTemperature } from "@/lib/utils"

export function WeatherWidget() {
  // Get temperature unit from settings
  const { settings, updateSettings } = useSettingsStore()
  const [unit, setUnit] = useState<"F" | "C">(settings.temperatureUnit)

  // Update local state when settings change
  useEffect(() => {
    setUnit(settings.temperatureUnit)
  }, [settings.temperatureUnit])

  // Base temperatures in Fahrenheit
  const baseTemp = 72
  const baseHigh = 78
  const baseLow = 65

  // Calculated temperatures based on current unit
  const temp = unit === "F" ? baseTemp : convertTemperature(baseTemp, "C")
  const highTemp = unit === "F" ? baseHigh : convertTemperature(baseHigh, "C")
  const lowTemp = unit === "F" ? baseLow : convertTemperature(baseLow, "C")

  // Toggle temperature unit
  const toggleUnit = () => {
    const newUnit = unit === "F" ? "C" : "F"
    setUnit(newUnit)
    // Also update in settings store
    updateSettings({ temperatureUnit: newUnit })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Local Weather</CardTitle>
          <CardDescription>Current conditions for your garden</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={toggleUnit} className="text-xs px-2">
          °{unit} → °{unit === "F" ? "C" : "F"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="h-10 w-10 text-yellow-500" />
            <CloudRain className="h-8 w-8 text-blue-500" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">
              {temp}°{unit}
            </div>
            <div className="text-sm text-muted-foreground">Partly cloudy with a chance of rain</div>
          </div>
          <div className="grid w-full grid-cols-3 gap-2 rounded-lg border p-2">
            <div className="flex flex-col items-center">
              <Thermometer className="h-4 w-4 text-rose-500" />
              <span className="text-xs font-medium">High</span>
              <span className="text-sm">
                {highTemp}°{unit}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Thermometer className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium">Low</span>
              <span className="text-sm">
                {lowTemp}°{unit}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <CloudRain className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium">Rain</span>
              <span className="text-sm">30%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

