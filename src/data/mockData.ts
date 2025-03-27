
import { Colaborador, Produto, Movimentacao, Veiculo, PedidoCompra, ItemPedido } from '../types';

// Mock de Colaboradores
export const colaboradoresMock: Colaborador[] = [
  {
    id: '1',
    nome: 'João Silva',
    cargo: 'Almoxarife',
    departamento: 'Almoxarifado',
    email: 'joao.silva@empresa.com',
    telefone: '(11) 98765-4321',
    dataCadastro: '2023-01-15',
    status: 'ativo'
  },
  {
    id: '2',
    nome: 'Maria Oliveira',
    cargo: 'Gerente de Estoque',
    departamento: 'Almoxarifado',
    email: 'maria.oliveira@empresa.com',
    telefone: '(11) 91234-5678',
    dataCadastro: '2023-01-10',
    status: 'ativo'
  },
  {
    id: '3',
    nome: 'Pedro Santos',
    cargo: 'Auxiliar de Almoxarifado',
    departamento: 'Almoxarifado',
    email: 'pedro.santos@empresa.com',
    telefone: '(11) 99876-5432',
    dataCadastro: '2023-02-05',
    status: 'ativo'
  },
  {
    id: '4',
    nome: 'Ana Souza',
    cargo: 'Compradora',
    departamento: 'Compras',
    email: 'ana.souza@empresa.com',
    telefone: '(11) 98888-7777',
    dataCadastro: '2023-01-20',
    status: 'ativo'
  },
  {
    id: '5',
    nome: 'Carlos Ferreira',
    cargo: 'Motorista',
    departamento: 'Logística',
    email: 'carlos.ferreira@empresa.com',
    telefone: '(11) 97777-8888',
    dataCadastro: '2023-03-10',
    status: 'ativo'
  }
];

// Mock de Produtos
export const produtosMock: Produto[] = [
  {
    id: '1',
    codigo: 'P001',
    nome: 'Papel A4',
    categoria: 'Material de Escritório',
    unidade: 'Resma',
    localizacao: 'Prateleira A1',
    quantidadeMinima: 10,
    quantidadeAtual: 25,
    fornecedor: 'Papelaria Central',
    dataCadastro: '2023-01-15'
  },
  {
    id: '2',
    codigo: 'P002',
    nome: 'Caneta Esferográfica Azul',
    categoria: 'Material de Escritório',
    unidade: 'Caixa',
    localizacao: 'Prateleira A2',
    quantidadeMinima: 5,
    quantidadeAtual: 12,
    fornecedor: 'Papelaria Central',
    dataCadastro: '2023-01-16'
  },
  {
    id: '3',
    codigo: 'P003',
    nome: 'Monitor 24"',
    categoria: 'Equipamento de Informática',
    unidade: 'Unidade',
    localizacao: 'Armário B1',
    quantidadeMinima: 2,
    quantidadeAtual: 3,
    fornecedor: 'Tech Informática',
    dataCadastro: '2023-01-17'
  },
  {
    id: '4',
    codigo: 'P004',
    nome: 'Teclado USB',
    categoria: 'Equipamento de Informática',
    unidade: 'Unidade',
    localizacao: 'Armário B2',
    quantidadeMinima: 3,
    quantidadeAtual: 5,
    fornecedor: 'Tech Informática',
    dataCadastro: '2023-01-18'
  },
  {
    id: '5',
    codigo: 'P005',
    nome: 'Cadeira de Escritório',
    categoria: 'Mobiliário',
    unidade: 'Unidade',
    localizacao: 'Setor C',
    quantidadeMinima: 1,
    quantidadeAtual: 4,
    fornecedor: 'Móveis Corporativos',
    dataCadastro: '2023-01-19'
  },
  {
    id: '6',
    codigo: 'P006',
    nome: 'Mesa de Escritório',
    categoria: 'Mobiliário',
    unidade: 'Unidade',
    localizacao: 'Setor C',
    quantidadeMinima: 1,
    quantidadeAtual: 2,
    fornecedor: 'Móveis Corporativos',
    dataCadastro: '2023-01-20'
  }
];

// Mock de Veículos
export const veiculosMock: Veiculo[] = [
  {
    id: '1',
    placa: 'ABC-1234',
    modelo: 'Saveiro',
    marca: 'Volkswagen',
    ano: 2020,
    tipo: 'Utilitário',
    responsavel: colaboradoresMock[4],
    status: 'disponivel'
  },
  {
    id: '2',
    placa: 'DEF-5678',
    modelo: 'Fiorino',
    marca: 'Fiat',
    ano: 2019,
    tipo: 'Utilitário',
    responsavel: colaboradoresMock[4],
    status: 'em_uso'
  },
  {
    id: '3',
    placa: 'GHI-9012',
    modelo: 'Strada',
    marca: 'Fiat',
    ano: 2021,
    tipo: 'Utilitário',
    responsavel: colaboradoresMock[4],
    status: 'disponivel'
  }
];

// Mock de Movimentações
export const movimentacoesMock: Movimentacao[] = [
  {
    id: '1',
    tipo: 'entrada',
    produto: produtosMock[0],
    quantidade: 10,
    responsavel: colaboradoresMock[0],
    dataMovimentacao: '2023-04-10T14:30:00',
    numeroDocumento: 'NF-12345'
  },
  {
    id: '2',
    tipo: 'saida',
    produto: produtosMock[0],
    quantidade: 2,
    responsavel: colaboradoresMock[2],
    dataMovimentacao: '2023-04-11T09:15:00',
    observacao: 'Solicitado pelo departamento de RH'
  },
  {
    id: '3',
    tipo: 'entrada',
    produto: produtosMock[1],
    quantidade: 5,
    responsavel: colaboradoresMock[0],
    dataMovimentacao: '2023-04-12T11:20:00',
    numeroDocumento: 'NF-12346'
  },
  {
    id: '4',
    tipo: 'saida',
    produto: produtosMock[2],
    quantidade: 1,
    responsavel: colaboradoresMock[2],
    dataMovimentacao: '2023-04-13T16:45:00',
    observacao: 'Solicitado pelo departamento de TI'
  }
];

// Mock de Pedidos de Compra
const itensPedido1: ItemPedido[] = [
  {
    id: '1',
    produto: produtosMock[0],
    quantidade: 20,
    observacao: 'Urgente'
  },
  {
    id: '2',
    produto: produtosMock[1],
    quantidade: 10
  }
];

const itensPedido2: ItemPedido[] = [
  {
    id: '3',
    produto: produtosMock[2],
    quantidade: 2
  },
  {
    id: '4',
    produto: produtosMock[3],
    quantidade: 5
  }
];

export const pedidosCompraMock: PedidoCompra[] = [
  {
    id: '1',
    numeroPedido: 'PC-2023-001',
    dataPedido: '2023-04-05',
    solicitante: colaboradoresMock[3],
    status: 'aprovado',
    itens: itensPedido1,
    observacao: 'Reposição de estoque',
    dataAprovacao: '2023-04-06'
  },
  {
    id: '2',
    numeroPedido: 'PC-2023-002',
    dataPedido: '2023-04-10',
    solicitante: colaboradoresMock[3],
    status: 'pendente',
    itens: itensPedido2,
    observacao: 'Novos equipamentos para o setor de TI'
  }
];

// Dados para o Dashboard
export const dashboardData = {
  totalProdutos: produtosMock.length,
  totalColaboradores: colaboradoresMock.length,
  totalVeiculos: veiculosMock.length,
  totalPedidosPendentes: pedidosCompraMock.filter(p => p.status === 'pendente').length,
  produtosBaixoEstoque: produtosMock.filter(p => p.quantidadeAtual <= p.quantidadeMinima),
  ultimasMovimentacoes: movimentacoesMock.slice(0, 5),
  ultimosPedidos: pedidosCompraMock.slice(0, 3)
};
