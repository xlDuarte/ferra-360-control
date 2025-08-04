import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  children?: ReactNode;
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  children
}: DashboardCardProps) {
  return (
    <Card className={cn("shadow-card hover:shadow-elevated transition-all duration-300 hover-scale animate-fade-in group", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-primary-glow" />
      </CardHeader>
      <CardContent className="animate-scale-in">
        <div className="text-2xl font-bold text-foreground mb-1 transition-all duration-300 group-hover:scale-105">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2 transition-colors duration-300 group-hover:text-foreground/80">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center text-xs animate-fade-in">
            <span
              className={cn(
                "font-medium transition-all duration-300",
                trend.isPositive ? "text-success group-hover:text-success-glow" : "text-destructive group-hover:text-destructive-glow"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-muted-foreground ml-1 transition-colors duration-300 group-hover:text-foreground/60">
              vs. mês anterior
            </span>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}