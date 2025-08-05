export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      custos: {
        Row: {
          created_at: string
          data_custo: string
          ferramenta_id: string
          fornecedor_id: string | null
          id: string
          numero_nf: string | null
          observacoes: string | null
          tipo_custo: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_custo: string
          ferramenta_id: string
          fornecedor_id?: string | null
          id?: string
          numero_nf?: string | null
          observacoes?: string | null
          tipo_custo: string
          valor: number
        }
        Update: {
          created_at?: string
          data_custo?: string
          ferramenta_id?: string
          fornecedor_id?: string | null
          id?: string
          numero_nf?: string | null
          observacoes?: string | null
          tipo_custo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "custos_ferramenta_id_fkey"
            columns: ["ferramenta_id"]
            isOneToOne: false
            referencedRelation: "ferramentas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      ferramentas: {
        Row: {
          categoria: string | null
          codigo: string
          created_at: string
          custo_aquisicao: number | null
          custo_reafiacao: number | null
          data_aquisicao: string | null
          descricao: string
          disponivel: number
          estoque_minimo: number
          fabricante: string | null
          fornecedor_id: string | null
          id: string
          localizacao: string | null
          observacoes: string | null
          quantidade: number
          status: string
          tipo: string | null
          updated_at: string
          valor_unitario: number | null
          vida_util_meses: number | null
        }
        Insert: {
          categoria?: string | null
          codigo: string
          created_at?: string
          custo_aquisicao?: number | null
          custo_reafiacao?: number | null
          data_aquisicao?: string | null
          descricao: string
          disponivel?: number
          estoque_minimo?: number
          fabricante?: string | null
          fornecedor_id?: string | null
          id?: string
          localizacao?: string | null
          observacoes?: string | null
          quantidade?: number
          status?: string
          tipo?: string | null
          updated_at?: string
          valor_unitario?: number | null
          vida_util_meses?: number | null
        }
        Update: {
          categoria?: string | null
          codigo?: string
          created_at?: string
          custo_aquisicao?: number | null
          custo_reafiacao?: number | null
          data_aquisicao?: string | null
          descricao?: string
          disponivel?: number
          estoque_minimo?: number
          fabricante?: string | null
          fornecedor_id?: string | null
          id?: string
          localizacao?: string | null
          observacoes?: string | null
          quantidade?: number
          status?: string
          tipo?: string | null
          updated_at?: string
          valor_unitario?: number | null
          vida_util_meses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ferramentas_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          cnpj: string | null
          contato: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nome: string
          status: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          contato?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          contato?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          status?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      historico_estoque: {
        Row: {
          data_operacao: string
          ferramenta_id: string
          id: string
          movimentacao_id: string | null
          observacoes: string | null
          quantidade_anterior: number
          quantidade_atual: number
          tipo_operacao: string
          usuario_id: string | null
        }
        Insert: {
          data_operacao?: string
          ferramenta_id: string
          id?: string
          movimentacao_id?: string | null
          observacoes?: string | null
          quantidade_anterior: number
          quantidade_atual: number
          tipo_operacao: string
          usuario_id?: string | null
        }
        Update: {
          data_operacao?: string
          ferramenta_id?: string
          id?: string
          movimentacao_id?: string | null
          observacoes?: string | null
          quantidade_anterior?: number
          quantidade_atual?: number
          tipo_operacao?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_estoque_ferramenta_id_fkey"
            columns: ["ferramenta_id"]
            isOneToOne: false
            referencedRelation: "ferramentas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_estoque_movimentacao_id_fkey"
            columns: ["movimentacao_id"]
            isOneToOne: false
            referencedRelation: "movimentacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_estoque_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      movements: {
        Row: {
          created_at: string
          custo_total: number | null
          data_movimento: string
          id: string
          observacoes: string | null
          quantidade: number
          quantidade_antes: number
          quantidade_depois: number
          sector_id: string | null
          setor: string
          status: string
          tipo: string
          tool_id: string
          usuario: string
        }
        Insert: {
          created_at?: string
          custo_total?: number | null
          data_movimento?: string
          id?: string
          observacoes?: string | null
          quantidade: number
          quantidade_antes: number
          quantidade_depois: number
          sector_id?: string | null
          setor: string
          status?: string
          tipo: string
          tool_id: string
          usuario: string
        }
        Update: {
          created_at?: string
          custo_total?: number | null
          data_movimento?: string
          id?: string
          observacoes?: string | null
          quantidade?: number
          quantidade_antes?: number
          quantidade_depois?: number
          sector_id?: string | null
          setor?: string
          status?: string
          tipo?: string
          tool_id?: string
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "movements_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movements_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      movimentacoes: {
        Row: {
          created_at: string
          data_movimentacao: string
          ferramenta_id: string
          id: string
          numero_nf: string | null
          observacoes: string | null
          quantidade: number
          saldo_anterior: number
          saldo_atual: number
          setor_id: string | null
          status: string
          tipo: string
          updated_at: string
          usuario_id: string
          valor_total: number | null
          valor_unitario: number | null
        }
        Insert: {
          created_at?: string
          data_movimentacao?: string
          ferramenta_id: string
          id?: string
          numero_nf?: string | null
          observacoes?: string | null
          quantidade: number
          saldo_anterior: number
          saldo_atual: number
          setor_id?: string | null
          status?: string
          tipo: string
          updated_at?: string
          usuario_id: string
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Update: {
          created_at?: string
          data_movimentacao?: string
          ferramenta_id?: string
          id?: string
          numero_nf?: string | null
          observacoes?: string | null
          quantidade?: number
          saldo_anterior?: number
          saldo_atual?: number
          setor_id?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          usuario_id?: string
          valor_total?: number | null
          valor_unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_ferramenta_id_fkey"
            columns: ["ferramenta_id"]
            isOneToOne: false
            referencedRelation: "ferramentas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          responsavel: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          responsavel?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          responsavel?: string | null
        }
        Relationships: []
      }
      setores: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          responsavel: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          responsavel?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          responsavel?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stock_history: {
        Row: {
          data_alteracao: string
          id: string
          movement_id: string | null
          quantidade_anterior: number
          quantidade_nova: number
          tipo_alteracao: string
          tool_id: string
        }
        Insert: {
          data_alteracao?: string
          id?: string
          movement_id?: string | null
          quantidade_anterior: number
          quantidade_nova: number
          tipo_alteracao: string
          tool_id: string
        }
        Update: {
          data_alteracao?: string
          id?: string
          movement_id?: string | null
          quantidade_anterior?: number
          quantidade_nova?: number
          tipo_alteracao?: string
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_history_movement_id_fkey"
            columns: ["movement_id"]
            isOneToOne: false
            referencedRelation: "movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_history_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          categoria: string
          codigo: string
          created_at: string
          custo_unitario: number
          descricao: string
          id: string
          localizacao: string | null
          quantidade_disponivel: number
          quantidade_minima: number
          quantidade_total: number
          status: string
          updated_at: string
        }
        Insert: {
          categoria: string
          codigo: string
          created_at?: string
          custo_unitario?: number
          descricao: string
          id?: string
          localizacao?: string | null
          quantidade_disponivel?: number
          quantidade_minima?: number
          quantidade_total?: number
          status?: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          codigo?: string
          created_at?: string
          custo_unitario?: number
          descricao?: string
          id?: string
          localizacao?: string | null
          quantidade_disponivel?: number
          quantidade_minima?: number
          quantidade_total?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          perfil: string
          setor_id: string | null
          status: string
          ultimo_acesso: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          perfil?: string
          setor_id?: string | null
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          perfil?: string
          setor_id?: string | null
          status?: string
          ultimo_acesso?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      has_profile: {
        Args: { user_id: string; profile_name: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
