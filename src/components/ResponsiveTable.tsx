import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden border rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}