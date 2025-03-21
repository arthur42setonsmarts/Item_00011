import { Home, Flower2, CalendarDays, Settings } from "lucide-react"

export const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Plants",
    href: "/plants",
    icon: <Flower2 className="h-5 w-5" />,
  },
  {
    name: "Activities",
    href: "/activities",
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

