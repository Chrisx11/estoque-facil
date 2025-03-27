
import { useState } from "react";
import { movimentacoesMock, produtosMock } from "@/data/mockData";
import { Movimentacao, Produto, Colaborador } from "@/types";
import { toast } from "sonner";

export const useMovimentacoes = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(movimentacoesMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMovimentacoes = movimentacoes.filter((movimentacao) => 
    movimentacao.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movimentacao.numeroDocumento && movimentacao.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSalvarMovimentacao = (novaMovimentacao: {
    tipo: "entrada" | "saida";
    produtoId: string;
    quantidade: number;
    responsavelId: string;
    observacao: string;
    veiculoId: string;
  }) => {
    const produto = produtosMock.find(p => p.id === novaMovimentacao.produtoId);
    const responsavel = colaboradoresMock.find(c => c.id === novaMovimentacao.responsavelId);
    const veiculo = veiculosMock.find(v => v.id === novaMovimentacao.veiculoId);

    if (!produto || !responsavel) {
      toast.error("Por favor, selecione produto e responsável");
      return;
    }

    const newId = (Math.max(...movimentacoes.map(m => parseInt(m.id))) + 1).toString();
    const novoRegistro: Movimentacao = {
      id: newId,
      tipo: novaMovimentacao.tipo,
      produto: produto,
      quantidade: novaMovimentacao.quantidade,
      responsavel: responsavel,
      dataMovimentacao: new Date().toISOString(),
      observacao: novaMovimentacao.observacao,
      numeroDocumento: veiculo ? veiculo.placa : undefined,
    };

    setMovimentacoes([novoRegistro, ...movimentacoes]);
    
    // Atualizar o estoque do produto
    const updatedProdutos = produtosMock.map(p => {
      if (p.id === produto.id) {
        const newQuantidade = novaMovimentacao.tipo === "entrada" 
          ? p.quantidadeAtual + novaMovimentacao.quantidade
          : p.quantidadeAtual - novaMovimentacao.quantidade;
        
        return {
          ...p,
          quantidadeAtual: newQuantidade
        };
      }
      return p;
    });
    
    // Substituir o array original
    produtosMock.length = 0;
    produtosMock.push(...updatedProdutos);
    
    toast.success(`${novaMovimentacao.tipo === "entrada" ? "Entrada" : "Saída"} registrada com sucesso!`);
    setIsDialogOpen(false);
  };

  return {
    movimentacoes,
    filteredMovimentacoes,
    searchTerm,
    isDialogOpen,
    setIsDialogOpen,
    handleSearch,
    handleSalvarMovimentacao,
  };
};

// Import missing variable
import { colaboradoresMock, veiculosMock } from "@/data/mockData";
