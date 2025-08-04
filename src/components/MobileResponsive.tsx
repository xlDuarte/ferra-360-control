import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileResponsiveProps {
  children: ReactNode;
  className?: string;
  mobileLayout?: "stack" | "scroll" | "collapse";
}

export function MobileResponsive({ 
  children, 
  className, 
  mobileLayout = "stack" 
}: MobileResponsiveProps) {
  const layoutClasses = {
    stack: "flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4",
    scroll: "overflow-x-auto whitespace-nowrap",
    collapse: "space-y-2 md:space-y-0"
  };

  return (
    <div className={cn(layoutClasses[mobileLayout], className)}>
      {children}
    </div>
  );
}

// Hook para detectar tamanho da tela
export function useResponsive() {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;
  const isTV = window.innerWidth >= 2560;

  return { isMobile, isTablet, isDesktop, isTV };
}