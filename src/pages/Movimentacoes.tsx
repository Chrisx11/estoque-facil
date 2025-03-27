
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useMovimentacoes } from "@/hooks/useMovimentacoes";
import MovimentacoesList from "@/components/movimentacoes/MovimentacoesList";
import MovimentacoesSearch from "@/components/movimentacoes/MovimentacoesSearch";
import MovimentacaoForm from "@/components/movimentacoes/MovimentacaoForm";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

const Movimentacoes = () => {
  const {
    filteredMovimentacoes,
    searchTerm,
    isDialogOpen,
    setIsDialogOpen,
    handleSearch,
    handleSalvarMovimentacao,
  } = useMovimentacoes();

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Movimentações</CardTitle>
              <CardDescription>
                Registre entradas e saídas de produtos
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Nova Movimentação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Nova Movimentação</DialogTitle>
                  <DialogDescription>
                    Registre uma entrada ou saída de produto
                  </DialogDescription>
                </DialogHeader>
                <MovimentacaoForm 
                  onSalvar={handleSalvarMovimentacao}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <MovimentacoesSearch 
            searchTerm={searchTerm} 
            onSearchChange={handleSearch} 
          />
          <MovimentacoesList movimentacoes={filteredMovimentacoes} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Movimentacoes;
