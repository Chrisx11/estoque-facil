
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
  ShoppingCart,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X
} from "lucide-react";
import { pedidosCompraMock, colaboradoresMock, produtosMock } from "@/data/mockData";
import { PedidoCompra, ItemPedido } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const Pedidos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pedidos, setPedidos] = useState<PedidoCompra[]>(pedidosCompraMock);
  const [isOpen, setIsOpen] = useState(false);
  const [isDetalheOpen, setIsDetalheOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoCompra | null>(null);
  
  // Formulário para novo pedido
  const [novoPedido, setNovoPedido] = useState({
    solicitanteId: "",
    observacao: "",
  });
  
  // Lista de itens para o novo pedido
  const [itensPedido, setItensPedido] = useState<{
    produtoId: string;
    quantidade: number;
    observacao: string;
  }[]>([]);

  const [novoItem, setNovoItem] = useState({
    produtoId: "",
    quantidade: 1,
    observacao: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovoPedido({ ...novoPedido, [name]: value });
  };

  const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "quantidade") {
      setNovoItem({
        ...novoItem,
        [name]: parseInt(value) || 1,
      });
    } else {
      setNovoItem({ ...novoItem, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNovoPedido({
      ...novoPedido,
      [name]: value,
    });
  };

  const handleItemSelectChange = (name: string, value: string) => {
    setNovoItem({
      ...novoItem,
      [name]: value,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addItemAoPedido = () => {
    if (!novoItem.produtoId) {
      toast.error("Selecione um produto");
      return;
    }
    
    if (novoItem.quantidade <= 0) {
      toast.error("A quantidade deve ser maior que zero");
      return;
    }
    
    setItensPedido([...itensPedido, { ...novoItem }]);
    setNovoItem({
      produtoId: "",
      quantidade: 1,
      observacao: "",
    });
  };

  const removeItemDoPedido = (index: number) => {
    const novosItens = [...itensPedido];
    novosItens.splice(index, 1);
    setItensPedido(novosItens);
  };

  const filteredPedidos = pedidos.filter((pedido) => 
    pedido.numeroPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.solicitante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "aprovado":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "concluido":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "cancelado":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "aprovado":
        return "Aprovado";
      case "concluido":
        return "Concluído";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  const handleSalvarPedido = () => {
    if (!novoPedido.solicitanteId) {
      toast.error("Selecione um solicitante");
      return;
    }
    
    if (itensPedido.length === 0) {
      toast.error("Adicione pelo menos um item ao pedido");
      return;
    }
    
    const solicitante = colaboradoresMock.find(c => c.id === novoPedido.solicitanteId);
    
    if (!solicitante) {
      toast.error("Solicitante não encontrado");
      return;
    }
    
    // Criar os itens do pedido
    const itens: ItemPedido[] = itensPedido.map((item, index) => {
      const produto = produtosMock.find(p => p.id === item.produtoId);
      
      if (!produto) {
        toast.error("Produto não encontrado");
        return {} as ItemPedido;
      }
      
      return {
        id: (index + 1).toString(),
        produto: produto,
        quantidade: item.quantidade,
        observacao: item.observacao,
      };
    });
    
    // Criar o novo pedido
    const newId = (Math.max(...pedidos.map(p => parseInt(p.id))) + 1).toString();
    const numeroPedido = `PC-${new Date().getFullYear()}-${newId.padStart(3, '0')}`;
    
    const novoPedidoObj: PedidoCompra = {
      id: newId,
      numeroPedido: numeroPedido,
      dataPedido: new Date().toISOString().split('T')[0],
      solicitante: solicitante,
      status: "pendente",
      itens: itens,
      observacao: novoPedido.observacao,
    };
    
    setPedidos([novoPedidoObj, ...pedidos]);
    toast.success("Pedido de compra criado com sucesso!");
    
    // Resetar o formulário
    setNovoPedido({
      solicitanteId: "",
      observacao: "",
    });
    setItensPedido([]);
    setIsOpen(false);
  };

  const visualizarPedido = (pedido: PedidoCompra) => {
    setPedidoSelecionado(pedido);
    setIsDetalheOpen(true);
  };
  
  const aprovarPedido = (pedido: PedidoCompra) => {
    const updatedPedidos = pedidos.map(p => {
      if (p.id === pedido.id) {
        return {
          ...p,
          status: "aprovado",
          dataAprovacao: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    });
    
    setPedidos(updatedPedidos);
    toast.success(`Pedido ${pedido.numeroPedido} aprovado com sucesso!`);
  };
  
  const concluirPedido = (pedido: PedidoCompra) => {
    const updatedPedidos = pedidos.map(p => {
      if (p.id === pedido.id) {
        return {
          ...p,
          status: "concluido",
          dataConclusao: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    });
    
    setPedidos(updatedPedidos);
    toast.success(`Pedido ${pedido.numeroPedido} concluído com sucesso!`);
  };
  
  const cancelarPedido = (pedido: PedidoCompra) => {
    const updatedPedidos = pedidos.map(p => {
      if (p.id === pedido.id) {
        return {
          ...p,
          status: "cancelado",
        };
      }
      return p;
    });
    
    setPedidos(updatedPedidos);
    toast.success(`Pedido ${pedido.numeroPedido} cancelado!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pedidos de Compra</CardTitle>
              <CardDescription>
                Gerencie os pedidos de compra da empresa
              </CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Novo Pedido
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Novo Pedido de Compra</DialogTitle>
                  <DialogDescription>
                    Crie um novo pedido de compra para o almoxarifado
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="solicitante">Solicitante</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("solicitanteId", value)}
                      value={novoPedido.solicitanteId}
                    >
                      <SelectTrigger id="solicitante">
                        <SelectValue placeholder="Selecione um solicitante" />
                      </SelectTrigger>
                      <SelectContent>
                        {colaboradoresMock.map((colaborador) => (
                          <SelectItem key={colaborador.id} value={colaborador.id}>
                            {colaborador.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label>Itens do Pedido</Label>
                      <span className="text-sm text-muted-foreground">
                        {itensPedido.length} {itensPedido.length === 1 ? "item" : "itens"}
                      </span>
                    </div>
                    
                    <Card className="p-3">
                      <div className="grid gap-3">
                        <div className="grid grid-cols-4 gap-2">
                          <div className="grid gap-1 col-span-2">
                            <Label htmlFor="produtoId" className="text-xs">Produto</Label>
                            <Select 
                              onValueChange={(value) => handleItemSelectChange("produtoId", value)}
                              value={novoItem.produtoId}
                            >
                              <SelectTrigger id="produtoId" className="h-8">
                                <SelectValue placeholder="Selecione um produto" />
                              </SelectTrigger>
                              <SelectContent>
                                {produtosMock.map((produto) => (
                                  <SelectItem key={produto.id} value={produto.id}>
                                    {produto.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor="quantidade" className="text-xs">Quantidade</Label>
                            <Input
                              id="quantidade"
                              name="quantidade"
                              type="number"
                              min="1"
                              className="h-8"
                              value={novoItem.quantidade}
                              onChange={handleItemInputChange}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button 
                              type="button" 
                              size="sm" 
                              className="w-full"
                              onClick={addItemAoPedido}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Adicionar
                            </Button>
                          </div>
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="observacaoItem" className="text-xs">Observação (opcional)</Label>
                          <Input
                            id="observacaoItem"
                            name="observacao"
                            className="h-8"
                            value={novoItem.observacao}
                            onChange={handleItemInputChange}
                            placeholder="Observação para este item"
                          />
                        </div>
                      </div>
                    </Card>
                    
                    {itensPedido.length > 0 && (
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Produto</TableHead>
                              <TableHead className="w-[80px]">Qtd.</TableHead>
                              <TableHead className="w-[60px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {itensPedido.map((item, index) => {
                              const produto = produtosMock.find(p => p.id === item.produtoId);
                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    {produto?.nome}
                                    {item.observacao && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {item.observacao}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>{item.quantidade}</TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                      onClick={() => removeItemDoPedido(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-2">
                    <Label htmlFor="observacao">Observação</Label>
                    <Textarea
                      id="observacao"
                      name="observacao"
                      value={novoPedido.observacao}
                      onChange={handleInputChange}
                      placeholder="Observações sobre o pedido"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setNovoPedido({
                        solicitanteId: "",
                        observacao: "",
                      });
                      setItensPedido([]);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSalvarPedido}>Criar Pedido</Button>
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
                placeholder="Buscar pedidos..."
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
                  <TableHead>Número</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                      Nenhum pedido encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPedidos.map((pedido) => (
                    <TableRow key={pedido.id} className="hover:bg-secondary/50">
                      <TableCell className="font-medium">{pedido.numeroPedido}</TableCell>
                      <TableCell>{new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{pedido.solicitante.nome}</TableCell>
                      <TableCell>{pedido.itens.length}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(pedido.status)}>
                          {getStatusLabel(pedido.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              ...
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => visualizarPedido(pedido)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            
                            {pedido.status === "pendente" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => aprovarPedido(pedido)}>
                                  <Check className="h-4 w-4 mr-2 text-green-600" />
                                  Aprovar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => cancelarPedido(pedido)}>
                                  <X className="h-4 w-4 mr-2 text-destructive" />
                                  Cancelar
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            {pedido.status === "aprovado" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => concluirPedido(pedido)}>
                                  <Check className="h-4 w-4 mr-2 text-green-600" />
                                  Concluir
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => cancelarPedido(pedido)}>
                                  <X className="h-4 w-4 mr-2 text-destructive" />
                                  Cancelar
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Sheet open={isDetalheOpen && pedidoSelecionado?.id === pedido.id} onOpenChange={setIsDetalheOpen}>
                          <SheetContent className="sm:max-w-[540px]">
                            <SheetHeader>
                              <SheetTitle>Detalhes do Pedido</SheetTitle>
                              <SheetDescription>
                                {pedidoSelecionado?.numeroPedido}
                              </SheetDescription>
                            </SheetHeader>
                            
                            {pedidoSelecionado && (
                              <div className="py-6 space-y-6">
                                <div className="space-y-1">
                                  <h3 className="text-sm font-medium text-muted-foreground">Informações do Pedido</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium">Data do Pedido</p>
                                      <p className="text-sm">{new Date(pedidoSelecionado.dataPedido).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Status</p>
                                      <Badge className={getStatusBadgeClass(pedidoSelecionado.status)}>
                                        {getStatusLabel(pedidoSelecionado.status)}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <h3 className="text-sm font-medium text-muted-foreground">Solicitante</h3>
                                  <p className="text-sm">{pedidoSelecionado.solicitante.nome}</p>
                                  <p className="text-sm text-muted-foreground">{pedidoSelecionado.solicitante.departamento}</p>
                                </div>

                                {pedidoSelecionado.observacao && (
                                  <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground">Observação</h3>
                                    <p className="text-sm">{pedidoSelecionado.observacao}</p>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <h3 className="text-sm font-medium text-muted-foreground">Itens do Pedido</h3>
                                  <div className="rounded-md border">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Produto</TableHead>
                                          <TableHead className="w-[80px] text-right">Qtd.</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {pedidoSelecionado.itens.map((item) => (
                                          <TableRow key={item.id}>
                                            <TableCell>
                                              {item.produto.nome}
                                              {item.observacao && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                  {item.observacao}
                                                </div>
                                              )}
                                            </TableCell>
                                            <TableCell className="text-right">{item.quantidade}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>

                                {/* Histórico de status */}
                                <div className="space-y-2">
                                  <h3 className="text-sm font-medium text-muted-foreground">Histórico</h3>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Criado em</span>
                                      <span>{new Date(pedidoSelecionado.dataPedido).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    
                                    {pedidoSelecionado.dataAprovacao && (
                                      <div className="flex items-center justify-between text-sm">
                                        <span>Aprovado em</span>
                                        <span>{new Date(pedidoSelecionado.dataAprovacao).toLocaleDateString('pt-BR')}</span>
                                      </div>
                                    )}
                                    
                                    {pedidoSelecionado.dataConclusao && (
                                      <div className="flex items-center justify-between text-sm">
                                        <span>Concluído em</span>
                                        <span>{new Date(pedidoSelecionado.dataConclusao).toLocaleDateString('pt-BR')}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <SheetFooter className="pt-4">
                              <SheetClose asChild>
                                <Button variant="outline">Fechar</Button>
                              </SheetClose>
                              
                              {pedidoSelecionado?.status === "pendente" && (
                                <Button 
                                  onClick={() => {
                                    if (pedidoSelecionado) {
                                      aprovarPedido(pedidoSelecionado);
                                      setIsDetalheOpen(false);
                                    }
                                  }}
                                >
                                  Aprovar Pedido
                                </Button>
                              )}
                              
                              {pedidoSelecionado?.status === "aprovado" && (
                                <Button 
                                  onClick={() => {
                                    if (pedidoSelecionado) {
                                      concluirPedido(pedidoSelecionado);
                                      setIsDetalheOpen(false);
                                    }
                                  }}
                                >
                                  Concluir Pedido
                                </Button>
                              )}
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
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

export default Pedidos;
