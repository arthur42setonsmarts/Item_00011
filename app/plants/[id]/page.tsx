import { PlantDetails } from "@/components/plant-details"
import { PlantActivities } from "@/components/plant-activities"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlantPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <PlantDetails id={params.id} />
      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="activities" className="mt-4">
          <PlantActivities plantId={params.id} />
        </TabsContent>
        <TabsContent value="notes" className="mt-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Plant Notes</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </TabsContent>
        <TabsContent value="gallery" className="mt-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Plant Gallery</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

