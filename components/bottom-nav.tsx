"use client"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"

const navItems = [
  { name: "home", icon: Home, href: "/" },
  { name: "search", icon: Search, href: "/search" },
  { name: "calendar", icon: Calendar, href: "/calendar" },
  { name: "profile", icon: User, href: "/profile" },
]

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-kaizen-black border-t border-kaizen-dark-gray z-50">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.name}
                variant="ghost"
                size="icon"
                className="rounded-full text-kaizen-gray"
              >
                <Icon className="w-5 h-5" />
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-kaizen-black border-t border-kaizen-dark-gray z-50">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.name === "home" && pathname === "/")
          return (
            <Button
              key={item.name}
              variant="ghost"
              size="icon"
              className={`rounded-full ${isActive ? "bg-kaizen-yellow text-kaizen-black" : "text-kaizen-gray hover:text-kaizen-white"}`}
              onClick={() => router.push(item.href)}
            >
              <Icon className="w-5 h-5" />
            </Button>
          )
        })}
      </div>
    </div>
  )
}
