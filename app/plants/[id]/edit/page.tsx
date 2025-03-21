import { PlantForm } from "@/components/plant-form"

export default function EditPlantPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Plant</h1>
      <PlantForm plantId={params.id} isEditing={true} />
    </div>
  )
}

