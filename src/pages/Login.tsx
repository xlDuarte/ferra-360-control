import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logoIndustrial from "@/assets/logo-industrial.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a lógica de autenticação
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-gradient-steel flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-industrial">
            <img src={logoIndustrial} alt="Estoque360" className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Estoque360</h1>
          <p className="text-muted-foreground">Sistema de Gestão de Ferramentaria</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-center text-xl">Acesso ao Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Lembrar de mim
                </Label>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary">
                Entrar
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-sm text-primary">
                  Esqueceu sua senha?
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>&copy; 2024 Estoque360. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}