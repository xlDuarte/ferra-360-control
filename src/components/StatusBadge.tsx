import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "destructive" | "secondary";
}

const statusVariants = {
  // Ferramentas
  "Ativo": "success",
  "Em Reafiamento": "warning", 
  "Descartado": "destructive",
  "Disponível": "success",
  "Em Uso": "warning",
  
  // Requisições
  "Pendente": "warning",
  "Aprovada": "success",
  "Aprovado": "success",
  "Rejeitada": "destructive",
  "Rejeitado": "destructive",
  "Em Análise": "secondary",
  "Em Andamento": "secondary",
  "Concluído": "success",
  
  // Ordens
  "Aberta": "warning",
  "Concluída": "success",
  "Cancelada": "destructive",
} as const;

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const defaultVariant = statusVariants[status as keyof typeof statusVariants] || "default";
  const finalVariant = variant || defaultVariant;

  return (
    <Badge 
      variant={finalVariant as any}
      className={cn(
        "text-xs font-medium",
        finalVariant === "success" && "bg-success text-success-foreground",
        finalVariant === "warning" && "bg-warning text-warning-foreground",
        finalVariant === "destructive" && "bg-destructive text-destructive-foreground"
      )}
    >
      {status}
    </Badge>
  );
}