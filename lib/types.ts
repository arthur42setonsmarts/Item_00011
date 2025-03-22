export type Plant = {
  id: string
  name: string
  variety: string
  location: string
  plantedDate: Date
  notes: string
  status: "growing" | "harvested" | "dormant"
}

