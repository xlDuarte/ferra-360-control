import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Ferramentas from "./pages/Ferramentas";
import Movimentacoes from "./pages/Movimentacoes";
import Requisicoes from "./pages/Requisicoes";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Main App Routes */}
          <Route path="/*" element={
            <div className="flex min-h-screen w-full bg-background">
              <Sidebar />
              <main className="flex-1 md:ml-0 ml-0 p-6 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/ferramentas" element={<Ferramentas />} />
                  <Route path="/estoque" element={<Ferramentas />} />
                  <Route path="/movimentacoes" element={<Movimentacoes />} />
                  <Route path="/requisicoes" element={<Requisicoes />} />
                  <Route path="/relatorios" element={<Dashboard />} />
                  <Route path="/usuarios" element={<Dashboard />} />
                  <Route path="/configuracoes" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
