import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Wrench, Package, ArrowRightLeft, FileText, 
  BarChart3, Settings, Users, Menu, X, Building2, DollarSign
} from "lucide-react";
import logoIndustrial from "@/assets/logo-industrial.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Custos", href: "/custos", icon: DollarSign },
  { name: "Movimentações", href: "/movimentacoes", icon: ArrowRightLeft },
  { name: "Requisições", href: "/requisicoes", icon: FileText },
  { name: "Estoque", href: "/estoque", icon: Package },
  { name: "Ferramentas", href: "/ferramentas", icon: Wrench },
  { name: "Fornecedores", href: "/fornecedores", icon: Building2 },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Usuários", href: "/usuarios", icon: Users },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card shadow-card hover-scale transition-all duration-300 hover:shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="transition-transform duration-300">
          {isOpen ? <X className="h-4 w-4 rotate-180" /> : <Menu className="h-4 w-4" />}
        </div>
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 2xl:w-72 3xl:w-80 tv:w-96 bg-card border-r border-border shadow-industrial transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 animate-fade-in",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-border bg-gradient-primary hover-scale">
          <div className="flex items-center gap-3 animate-scale-in">
            <img src={logoIndustrial} alt="Ferramentaria 4.0" className="h-8 w-8 transition-transform duration-300 hover:rotate-12" />
            <h1 className="text-xl font-bold text-primary-foreground">Ferramentaria 4.0</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 animate-fade-in">
          <ul className="space-y-1">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <NavLink
                    to={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 hover-scale transform",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-card scale-105"
                        : "text-foreground hover:bg-secondary hover:text-secondary-foreground hover:translate-x-1"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300",
                        isActive ? "text-primary-foreground animate-pulse" : "text-muted-foreground group-hover:text-secondary-foreground group-hover:scale-110"
                      )}
                    />
                    <span className="transition-all duration-300">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}