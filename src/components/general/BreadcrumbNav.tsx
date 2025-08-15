import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export function BreadcrumbNav() {
    const location = useLocation();
    const breadcrumbSegments = buildBreadcrumbSegments(location.pathname);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbSegments.map((segment, idx) => (
                    <BreadcrumbItem key={segment.path}>
                        {idx < breadcrumbSegments.length - 1 ? (
                            <>
                                <BreadcrumbLink asChild>
                                    <Link to={segment.path}>{segment.label}</Link>
                                </BreadcrumbLink>
                                <BreadcrumbSeparator />
                            </>
                        ) : (
                            <span className="text-header-foreground">{segment.label}</span>
                        )}
                    </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

function buildBreadcrumbSegments(pathname: string) {
    const parts = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);

    return parts.map((part, idx) => {
    const path = "/" + parts.slice(0, idx + 1).join("/");
    const label = part.charAt(0).toUpperCase() + part.slice(1);
    return { label, path };
  });
}