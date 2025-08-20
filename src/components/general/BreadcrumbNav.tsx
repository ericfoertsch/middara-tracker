import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function BreadcrumbNav() {
  const location = useLocation();
  const breadcrumbSegments = buildBreadcrumbSegments(location.pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbSegments.map((segment, idx) => (
          <React.Fragment key={segment.path}>
            <BreadcrumbItem>
              {idx < breadcrumbSegments.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={segment.path}>{segment.label}</Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-header-foreground">{segment.label}</span>
              )}
            </BreadcrumbItem>
            {idx < breadcrumbSegments.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function buildBreadcrumbSegments(pathname: string) {
  const parts = pathname
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  return parts.map((part, idx) => {
    const path = "/" + parts.slice(0, idx + 1).join("/");
    const label = part.charAt(0).toUpperCase() + part.slice(1);
    return { label, path };
  });
}
