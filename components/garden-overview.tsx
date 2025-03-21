import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const gardenBeds = [
  {
    id: 1,
    name: "Vegetable Bed",
    capacity: 80,
    plants: ["Tomato", "Cucumber", "Lettuce", "Pepper"],
  },
  {
    id: 2,
    name: "Herb Garden",
    capacity: 60,
    plants: ["Basil", "Mint", "Rosemary"],
  },
  {
    id: 3,
    name: "Flower Bed",
    capacity: 40,
    plants: ["Sunflower", "Marigold"],
  },
]

export function GardenOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Garden Overview</CardTitle>
        <CardDescription>Status of your garden beds and spaces</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {gardenBeds.map((bed) => (
            <div key={bed.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{bed.name}</p>
                  <p className="text-xs text-muted-foreground">{bed.plants.join(", ")}</p>
                </div>
                <span className="text-sm font-medium">{bed.capacity}%</span>
              </div>
              <Progress value={bed.capacity} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

