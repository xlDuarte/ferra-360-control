import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Package,
  Wrench,
  ArrowLeftRight,
  Truck,
  FileText,
  Settings,
  Menu,
  X,
  BarChart3,
  DollarSign,
  ClipboardList,
  Users,
  LogOut,
} from "lucide-react";
import logoIndustrial from "@/assets/logo-industrial.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { usuario, signOut, hasPermission } = useAuth();

  const menuItems = [
    { name: "Dashboard", icon: BarChart3, path: "/" },
    { name: "Ferramentas", icon: Wrench, path: "/ferramentas" },
    { name: "Estoque", icon: Package, path: "/estoque" },
    { name: "Movimentações", icon: ArrowLeftRight, path: "/movimentacoes" },
    { name: "Fornecedores", icon: Truck, path: "/fornecedores" },
    { name: "Relatórios", icon: FileText, path: "/relatorios" },
    { name: "Custos", icon: DollarSign, path: "/custos" },
    { name: "Requisições", icon: ClipboardList, path: "/requisicoes" },
    ...(hasPermission(['Administrador']) ? [{ name: "Usuários", icon: Users, path: "/usuarios" }] : []),
    ...(hasPermission(['Administrador', 'Supervisor']) ? [{ name: "Configurações", icon: Settings, path: "/configuracoes" }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <img src={logoIndustrial} alt="Logo" className="w-8 h-8" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Gerdau - SmartFerramentaria+</h2>
                <p className="text-xs text-muted-foreground">Sistema Inteligente</p>
              </div>
            </div>

            {/* User Info */}
            {usuario && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {usuario.nome.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {usuario.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {usuario.perfil}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex-1 p-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors mb-1",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}