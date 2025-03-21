import { PlantsTable } from "@/components/plants-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function PlantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Plants</h1>
        <Link href="/plants/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Plant
          </Button>
        </Link>
      </div>
      <PlantsTable />
    </div>
  )
}

