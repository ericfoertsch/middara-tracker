import { Link, useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

const SEGMENT_LABELS: Record<string, string> = {
  characters: "Characters",
  builds: "Builds",
  campaigns: "Campaigns",
  disciplines: "Disciplines",
  tags: "Tags",
  settings: "Settings",
  test: "Build Tester",
  session: "Session",
}

function buildSegments(pathname: string) {
  const parts = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean)
  const home = { label: "Home", path: "/" }
  if (parts.length === 0) return [home]

  const rest = parts.map((part, idx) => ({
    label: SEGMENT_LABELS[part] ?? part.charAt(0).toUpperCase() + part.slice(1),
    path: "/" + parts.slice(0, idx + 1).join("/"),
  }))

  return [home, ...rest]
}

export function BreadcrumbNav() {
  const location = useLocation()
  const segments = buildSegments(location.pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, idx) => (
          <React.Fragment key={seg.path}>
            <BreadcrumbItem>
              {idx < segments.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={seg.path}>{seg.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{seg.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {idx < segments.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
