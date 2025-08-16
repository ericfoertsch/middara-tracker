import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  subcategory: string;
  categoryColor?: string;
  subcategoryColor?: string;
  className?: string;
}

export function CategoryBadge({
  category,
  subcategory,
  categoryColor = "#4B5563",
  subcategoryColor = "#6B7280",
  className,
}: CategoryBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex text-white text-xs font-medium leading-none",
        className
      )}
    >
      <span
        className="px-2 py-0.5 border-r border-white/30 rounded-l-full"
        style={{ backgroundColor: categoryColor }}
      >
        {category}
      </span>
      <span
        className="px-2 py-0.5 rounded-r-full"
        style={{ backgroundColor: subcategoryColor }}
      >
        {subcategory}
      </span>
    </div>
  );
}
