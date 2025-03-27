
// Tipos para os colaboradores
export interface Colaborador {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  telefone: string;
  dataCadastro: string;
  status: "ativo" | "inativo";
}

// Tipos para os produtos
export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  unidade: string;
  localizacao: string;
  quantidadeMinima: number;
  quantidadeAtual: number;
  fornecedor: string;
  dataCadastro: string;
}

// Tipos para as movimentações
export interface Movimentacao {
  id: string;
  tipo: "entrada" | "saida";
  produto: Produto;
  quantidade: number;
  responsavel: Colaborador;
  dataMovimentacao: string;
  observacao?: string;
  numeroDocumento?: string;
}

// Tipos para os veículos
export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: string;
  responsavel: Colaborador;
  status: "disponivel" | "em_uso" | "manutencao";
}

// Tipos para os pedidos de compra
export interface ItemPedido {
  id: string;
  produto: Produto;
  quantidade: number;
  observacao?: string;
}

export interface PedidoCompra {
  id: string;
  numeroPedido: string;
  dataPedido: string;
  solicitante: Colaborador;
  status: "pendente" | "aprovado" | "concluido" | "cancelado";
  itens: ItemPedido[];
  observacao?: string;
  dataAprovacao?: string;
  dataConclusao?: string;
}
