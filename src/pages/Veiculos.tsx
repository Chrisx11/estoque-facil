
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
  Truck,
  Edit,
  Trash2,
  Filter
} from "lucide-react";
import { veiculosMock, colaboradoresMock } from "@/data/mockData";
import { Veiculo } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const Veiculos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [veiculos, setVeiculos] = useState<Veiculo[]>(veiculosMock);
  const [isOpen, setIsOpen] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);
  
  // Formulário para novo veículo
  const [novoVeiculo, setNovoVeiculo] = useState({
    placa: "",
    modelo: "",
    marca: "",
    ano: new Date().getFullYear(),
    tipo: "",
    responsavelId: "",
    status: "disponivel" as "disponivel" | "em_uso" | "manutencao",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "ano") {
      setNovoVeiculo({
        ...novoVeiculo,
        [name]: parseInt(value) || new Date().getFullYear(),
      });
    } else {
      setNovoVeiculo({ ...novoVeiculo, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setNovoVeiculo({
      ...novoVeiculo,
      [name]: value,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredVeiculos = veiculos.filter((veiculo) => 
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "em_uso":
        return "Em Uso";
      case "manutencao":
        return "Manutenção";
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "disponivel":
        return "text-green-600 border-green-600";
      case "em_uso":
        return "text-blue-600 border-blue-600";
      case "manutencao":
        return "text-amber-500 border-amber-500";
      default:
        return "";
    }
  };

  const handleSalvar = () => {
    const responsavel = colaboradoresMock.find(c => c.id === novoVeiculo.responsavelId);
    
    if (!responsavel) {
      toast.error("Por favor, selecione um responsável");
      return;
    }

    if (editingVeiculo) {
      // Editando veículo existente
      const updatedVeiculos = veiculos.map(v => {
        if (v.id === editingVeiculo.id) {
          return {
            ...v,
            placa: novoVeiculo.placa,
            modelo: novoVeiculo.modelo,
            marca: novoVeiculo.marca,
            ano: novoVeiculo.ano,
            tipo: novoVeiculo.tipo,
            responsavel: responsavel,
            status: novoVeiculo.status,
          };
        }
        return v;
      });
      setVeiculos(updatedVeiculos);
      toast.success("Veículo atualizado com sucesso!");
    } else {
      // Adicionando novo veículo
      const newId = (Math.max(...veiculos.map(v => parseInt(v.id))) + 1).toString();
      const novoRegistro: Veiculo = {
        id: newId,
        placa: novoVeiculo.placa,
        modelo: novoVeiculo.modelo,
        marca: novoVeiculo.marca,
        ano: novoVeiculo.ano,
        tipo: novoVeiculo.tipo,
        responsavel: responsavel,
        status: novoVeiculo.status,
      };
      setVeiculos([...veiculos, novoRegistro]);
      toast.success("Veículo adicionado com sucesso!");
    }
    
    setNovoVeiculo({
      placa: "",
      modelo: "",
      marca: "",
      ano: new Date().getFullYear(),
      tipo: "",
      responsavelId: "",
      status: "disponivel",
    });
    setEditingVeiculo(null);
    setIsOpen(false);
  };

  const handleEditar = (veiculo: Veiculo) => {
    setEditingVeiculo(veiculo);
    setNovoVeiculo({
      placa: veiculo.placa,
      modelo: veiculo.modelo,
      marca: veiculo.marca,
      ano: veiculo.ano,
      tipo: veiculo.tipo,
      responsavelId: veiculo.responsavel.id,
      status: veiculo.status,
    });
    setIsOpen(true);
  };
  
  const handleExcluir = (id: string) => {
    setVeiculos(veiculos.filter(v => v.id !== id));
    toast.success("Veículo excluído com sucesso!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Veículos</CardTitle>
              <CardDescription>
                Gerencie a frota de veículos da empresa
              </CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Truck className="h-4 w-4" />
                  Novo Veículo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingVeiculo ? "Editar Veículo" : "Novo Veículo"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados do veículo abaixo
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="placa">Placa</Label>
                    <Input
                      id="placa"
                      name="placa"
                      value={novoVeiculo.placa}
                      onChange={handleInputChange}
                      placeholder="AAA-0000"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="modelo">Modelo</Label>
                      <Input
                        id="modelo"
                        name="modelo"
                        value={novoVeiculo.modelo}
                        onChange={handleInputChange}
                        placeholder="Modelo do veículo"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="marca">Marca</Label>
                      <Input
                        id="marca"
                        name="marca"
                        value={novoVeiculo.marca}
                        onChange={handleInputChange}
                        placeholder="Marca do veículo"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="ano">Ano</Label>
                      <Input
                        id="ano"
                        name="ano"
                        type="number"
                        value={novoVeiculo.ano}
                        onChange={handleInputChange}
                        placeholder="Ano do veículo"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Input
                        id="tipo"
                        name="tipo"
                        value={novoVeiculo.tipo}
                        onChange={handleInputChange}
                        placeholder="Tipo do veículo"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("responsavelId", value)}
                      value={novoVeiculo.responsavelId}
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
                  
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange("status", value as "disponivel" | "em_uso" | "manutencao")}
                      value={novoVeiculo.status}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="em_uso">Em Uso</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setEditingVeiculo(null);
                      setNovoVeiculo({
                        placa: "",
                        modelo: "",
                        marca: "",
                        ano: new Date().getFullYear(),
                        tipo: "",
                        responsavelId: "",
                        status: "disponivel",
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
                placeholder="Buscar veículos..."
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
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Marca/Ano</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVeiculos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                      Nenhum veículo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVeiculos.map((veiculo) => (
                    <TableRow key={veiculo.id} className="hover:bg-secondary/50">
                      <TableCell className="font-medium">{veiculo.placa}</TableCell>
                      <TableCell>{veiculo.modelo}</TableCell>
                      <TableCell>{veiculo.marca} / {veiculo.ano}</TableCell>
                      <TableCell>{veiculo.tipo}</TableCell>
                      <TableCell>{veiculo.responsavel.nome}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusBadgeClass(veiculo.status)}
                        >
                          {getStatusLabel(veiculo.status)}
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
                            <DropdownMenuItem onClick={() => handleEditar(veiculo)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleExcluir(veiculo.id)}
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

export default Veiculos;
