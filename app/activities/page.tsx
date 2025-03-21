import { ActivitiesCalendar } from "@/components/activities-calendar"
import { ActivitiesTable } from "@/components/activities-table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <ActivitiesTable />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <ActivitiesCalendar />
        </TabsContent>
      </Tabs>
    </div>
  )
}

