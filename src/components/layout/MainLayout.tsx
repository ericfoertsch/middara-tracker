import { Separator } from "@/components/ui/separator";
import { SidebarLink } from "@/components/general/SidebarLink"
import type { ReactNode } from "react";
import { BreadcrumbNav } from "../general/BreadcrumbNav";

interface MainLayoutProps {
    children: ReactNode
    breadcrumb?: string
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="h-screen flex flex-col">
            <header className="flex items-center bg-muted border-b px-4 h-14">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary rounded" />
                    <Separator orientation="vertical" className="h-6" />
                    <BreadcrumbNav />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-48 bg-muted/40 border-r p-4 space-y-2">
                    <nav className="flex flex-col space-y-1">
                        <SidebarLink href="/dashboard/dashboard2">Dashboard</SidebarLink>
                        <SidebarLink href="/builder">Builder</SidebarLink>
                        <SidebarLink href="/settings">Settings</SidebarLink>
                    </nav>
                </aside>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
