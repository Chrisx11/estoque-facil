
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Filter } from "lucide-react";
import { movimentacoesMock, produtosMock, colaboradoresMock, veiculosMock } from "@/data/mockData";
import { Movimentacao, Produto, Colaborador, Veiculo } from "@/types";
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
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Movimentacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(movimentacoesMock);
  const [isOpen, setIsOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehiclePopoverOpen, setVehiclePopoverOpen] = useState(false);
  
  // Formulário para nova movimentação
  const [novaMovimentacao, setNovaMovimentacao] = useState({
    tipo: "entrada" as "entrada" | "saida",
    produtoId: "",
    quantidade: 1,
    responsavelId: "",
    observacao: "",
    veiculoId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "quantidade") {
      setNovaMovimentacao({
        ...novaMovimentacao,
        [name]: parseInt(value) || 1,
      });
    } else {
      setNovaMovimentacao({ ...novaMovimentacao, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNovaMovimentacao({
      ...novaMovimentacao,
      [name]: value,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMovimentacoes = movimentacoes.filter((movimentacao) => 
    movimentacao.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movimentacao.responsavel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (movimentacao.numeroDocumento && movimentacao.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Ensure filteredVehicles never returns undefined
  const filteredVehicles = vehicleSearch.trim() === "" 
    ? veiculosMock 
    : veiculosMock.filter((veiculo) =>
        veiculo.placa.toLowerCase().includes(vehicleSearch.toLowerCase())
      );

  const handleSalvar = () => {
    const produto = produtosMock.find(p => p.id === novaMovimentacao.produtoId);
    const responsavel = colaboradoresMock.find(c => c.id === novaMovimentacao.responsavelId);
    const veiculo = veiculosMock.find(v => v.id === novaMovimentacao.veiculoId);

    if (!produto || !responsavel) {
      toast.error("Por favor, selecione produto e responsável");
      return;
    }

    if (!veiculo && novaMovimentacao.tipo === "entrada") {
      toast.error("Por favor, selecione um veículo");
      return;
    }

    if (novaMovimentacao.quantidade <= 0) {
      toast.error("A quantidade deve ser maior que zero");
      return;
    }

    // Verificar se há estoque suficiente para saída
    if (novaMovimentacao.tipo === "saida" && produto.quantidadeAtual < novaMovimentacao.quantidade) {
      toast.error("Quantidade insuficiente em estoque");
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
    
    setNovaMovimentacao({
      tipo: "entrada",
      produtoId: "",
      quantidade: 1,
      responsavelId: "",
      observacao: "",
      veiculoId: "",
    });
    
    setIsOpen(false);
  };

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
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Tipo de Movimentação</Label>
                    <RadioGroup 
                      defaultValue="entrada" 
                      value={novaMovimentacao.tipo}
                      onValueChange={(value) => handleSelectChange("tipo", value as "entrada" | "saida")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="entrada" id="entrada" />
                        <Label htmlFor="entrada" className="cursor-pointer">Entrada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="saida" id="saida" />
                        <Label htmlFor="saida" className="cursor-pointer">Saída</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="produto">Produto</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("produtoId", value)}
                      value={novaMovimentacao.produtoId}
                    >
                      <SelectTrigger id="produto">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {produtosMock.map((produto) => (
                          <SelectItem key={produto.id} value={produto.id}>
                            {produto.nome} ({produto.quantidadeAtual} em estoque)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      name="quantidade"
                      type="number"
                      min="1"
                      value={novaMovimentacao.quantidade}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("responsavelId", value)}
                      value={novaMovimentacao.responsavelId}
                    >
                      <SelectTrigger id="responsavel">
                        <SelectValue placeholder="Selecione um responsável" />
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

                  {novaMovimentacao.tipo === "entrada" && (
                    <div className="grid gap-2">
                      <Label htmlFor="veiculo">Veículo</Label>
                      <Popover open={vehiclePopoverOpen} onOpenChange={setVehiclePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={vehiclePopoverOpen}
                            className="justify-between w-full font-normal"
                          >
                            {novaMovimentacao.veiculoId ? (
                              veiculosMock.find((veiculo) => veiculo.id === novaMovimentacao.veiculoId)?.placa
                            ) : (
                              "Selecione um veículo"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput 
                              placeholder="Buscar pela placa..." 
                              value={vehicleSearch}
                              onValueChange={setVehicleSearch}
                            />
                            <CommandEmpty>Nenhum veículo encontrado</CommandEmpty>
                            {filteredVehicles.length > 0 && (
                              <CommandGroup>
                                {filteredVehicles.map((veiculo) => (
                                  <CommandItem
                                    key={veiculo.id}
                                    value={veiculo.id}
                                    onSelect={(value) => {
                                      handleSelectChange("veiculoId", value);
                                      setVehiclePopoverOpen(false);
                                    }}
                                  >
                                    {veiculo.placa} - {veiculo.modelo} ({veiculo.marca})
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="observacao">Observação</Label>
                    <Textarea
                      id="observacao"
                      name="observacao"
                      value={novaMovimentacao.observacao}
                      onChange={handleInputChange}
                      placeholder="Observações sobre a movimentação"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setNovaMovimentacao({
                        tipo: "entrada",
                        produtoId: "",
                        quantidade: 1,
                        responsavelId: "",
                        observacao: "",
                        veiculoId: "",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSalvar}>Registrar</Button>
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
                placeholder="Buscar movimentações..."
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
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Veículo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovimentacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                      Nenhuma movimentação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovimentacoes.map((movimentacao) => (
                    <TableRow key={movimentacao.id} className="hover:bg-secondary/50">
                      <TableCell>
                        {new Date(movimentacao.dataMovimentacao).toLocaleDateString('pt-BR')}
                        <div className="text-xs text-muted-foreground">
                          {new Date(movimentacao.dataMovimentacao).toLocaleTimeString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={movimentacao.tipo === 'entrada' ? 'outline' : 'secondary'} className={`
                          ${movimentacao.tipo === 'entrada' 
                            ? 'text-green-600 border-green-600' 
                            : 'text-blue-600 border-blue-600'
                          }
                        `}>
                          {movimentacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{movimentacao.produto.nome}</TableCell>
                      <TableCell>{movimentacao.quantidade} {movimentacao.produto.unidade}</TableCell>
                      <TableCell>{movimentacao.responsavel.nome}</TableCell>
                      <TableCell>{movimentacao.numeroDocumento || "-"}</TableCell>
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

export default Movimentacoes;
