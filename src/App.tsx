import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Ferramentas from "./pages/Ferramentas";
import Estoque from "./pages/Estoque";
import Movimentacoes from "./pages/Movimentacoes";
import Requisicoes from "./pages/Requisicoes";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
import Fornecedores from "./pages/Fornecedores";
import Custos from "./pages/Custos";
import Configuracoes from "./pages/Configuracoes";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function MainLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-0 ml-0 p-3 sm:p-4 md:p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ferramentas" element={<Ferramentas />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
          <Route path="/requisicoes" element={<Requisicoes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/custos" element={<Custos />} />
          <Route 
            path="/usuarios" 
            element={
              <ProtectedRoute allowedProfiles={['Administrador']}>
                <Usuarios />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configuracoes" 
            element={
              <ProtectedRoute allowedProfiles={['Administrador', 'Supervisor']}>
                <Configuracoes />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;