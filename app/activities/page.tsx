import { ActivitiesTable } from "@/components/activities-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Garden Activities</h1>
        <Link href="/activities/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        </Link>
      </div>
      <ActivitiesTable />
    </div>
  )
}

