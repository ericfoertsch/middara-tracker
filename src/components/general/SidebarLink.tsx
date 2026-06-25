import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

export function SidebarLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <NavLink
      to={href}
      end={href === "/"}
      className={({ isActive }) =>
        cn(
          "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      {children}
    </NavLink>
  )
}
