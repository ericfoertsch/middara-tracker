import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SidebarLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      )}
    >
      {children}
    </a>
  );
}