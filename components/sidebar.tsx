"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navigationItems } from "@/lib/navigation"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="grid gap-1 text-sm font-medium">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent",
                pathname === item.href ? "bg-accent" : "transparent",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

