import { DashboardStats } from "@/components/dashboard-stats"
import { UpcomingActivities } from "@/components/upcoming-activities"
import { RecentActivities } from "@/components/recent-activities"
import { WeatherWidget } from "@/components/weather-widget"
import { GardenOverview } from "@/components/garden-overview"

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Garden Dashboard</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <UpcomingActivities />
          <RecentActivities />
        </div>
        <div className="space-y-6">
          <WeatherWidget />
          <GardenOverview />
        </div>
      </div>
    </div>
  )
}

