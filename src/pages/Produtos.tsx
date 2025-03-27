
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Package,
  Edit,
  Trash2,
  Filter
} from "lucide-react";
import { produtosMock } from "@/data/mockData";
import { Produto } from "@/types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>(produtosMock);
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  
  // Formulário para novo produto
  const [novoProduto, setNovoProduto] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    unidade: "",
    localizacao: "",
    quantidadeMinima: 0,
    quantidadeAtual: 0,
    fornecedor: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Para campos numéricos
    if (name === "quantidadeMinima" || name === "quantidadeAtual") {
      setNovoProduto({
        ...novoProduto,
        [name]: parseInt(value) || 0,
      });
    } else {
      setNovoProduto({ ...novoProduto, [name]: value });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProdutos = produtos.filter((produto) => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSalvar = () => {
    if (editingProduto) {
      // Editando produto existente
      const updatedProdutos = produtos.map(p => 
        p.id === editingProduto.id ? {...editingProduto, ...novoProduto} : p
      );
      setProdutos(updatedProdutos);
      toast.success("Produto atualizado com sucesso!");
    } else {
      // Adicionando novo produto
      const newId = (Math.max(...produtos.map(p => parseInt(p.id))) + 1).toString();
      const novoRegistro: Produto = {
        id: newId,
        codigo: novoProduto.codigo,
        nome: novoProduto.nome,
        categoria: novoProduto.categoria,
        unidade: novoProduto.unidade,
        localizacao: novoProduto.localizacao,
        quantidadeMinima: novoProduto.quantidadeMinima,
        quantidadeAtual: novoProduto.quantidadeAtual,
        fornecedor: novoProduto.fornecedor,
        dataCadastro: new Date().toISOString().split('T')[0],
      };
      setProdutos([...produtos, novoRegistro]);
      toast.success("Produto adicionado com sucesso!");
    }
    
    setNovoProduto({
      codigo: "",
      nome: "",
      categoria: "",
      unidade: "",
      localizacao: "",
      quantidadeMinima: 0,
      quantidadeAtual: 0,
      fornecedor: "",
    });
    setEditingProduto(null);
    setIsOpen(false);
  };

  const handleEditar = (produto: Produto) => {
    setEditingProduto(produto);
    setNovoProduto({
      codigo: produto.codigo,
      nome: produto.nome,
      categoria: produto.categoria,
      unidade: produto.unidade,
      localizacao: produto.localizacao,
      quantidadeMinima: produto.quantidadeMinima,
      quantidadeAtual: produto.quantidadeAtual,
      fornecedor: produto.fornecedor,
    });
    setIsOpen(true);
  };
  
  const handleExcluir = (id: string) => {
    setProdutos(produtos.filter(p => p.id !== id));
    toast.success("Produto excluído com sucesso!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>
                Gerencie os produtos do almoxarifado
              </CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Package className="h-4 w-4" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduto ? "Editar Produto" : "Novo Produto"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados do produto abaixo
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="codigo">Código</Label>
                      <Input
                        id="codigo"
                        name="codigo"
                        value={novoProduto.codigo}
                        onChange={handleInputChange}
                        placeholder="Código do produto"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={novoProduto.nome}
                        onChange={handleInputChange}
                        placeholder="Nome do produto"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Input
                        id="categoria"
                        name="categoria"
                        value={novoProduto.categoria}
                        onChange={handleInputChange}
                        placeholder="Categoria"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="unidade">Unidade</Label>
                      <Input
                        id="unidade"
                        name="unidade"
                        value={novoProduto.unidade}
                        onChange={handleInputChange}
                        placeholder="Unidade de medida"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input
                      id="localizacao"
                      name="localizacao"
                      value={novoProduto.localizacao}
                      onChange={handleInputChange}
                      placeholder="Localização no almoxarifado"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="quantidadeMinima">Quantidade Mínima</Label>
                      <Input
                        id="quantidadeMinima"
                        name="quantidadeMinima"
                        type="number"
                        value={novoProduto.quantidadeMinima}
                        onChange={handleInputChange}
                        placeholder="Quantidade mínima"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quantidadeAtual">Quantidade Atual</Label>
                      <Input
                        id="quantidadeAtual"
                        name="quantidadeAtual"
                        type="number"
                        value={novoProduto.quantidadeAtual}
                        onChange={handleInputChange}
                        placeholder="Quantidade atual"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fornecedor">Fornecedor</Label>
                    <Input
                      id="fornecedor"
                      name="fornecedor"
                      value={novoProduto.fornecedor}
                      onChange={handleInputChange}
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setEditingProduto(null);
                      setNovoProduto({
                        codigo: "",
                        nome: "",
                        categoria: "",
                        unidade: "",
                        localizacao: "",
                        quantidadeMinima: 0,
                        quantidadeAtual: 0,
                        fornecedor: "",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSalvar}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProdutos.map((produto) => (
                    <TableRow key={produto.id} className="hover:bg-secondary/50">
                      <TableCell>{produto.codigo}</TableCell>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{produto.quantidadeAtual} {produto.unidade}</span>
                          {produto.quantidadeAtual <= produto.quantidadeMinima && (
                            <Badge variant="outline" className="text-amber-500 border-amber-500">
                              Baixo
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{produto.localizacao}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              ...
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditar(produto)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleExcluir(produto.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Produtos;
