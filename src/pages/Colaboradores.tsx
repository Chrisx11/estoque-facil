
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
  Plus, 
  UserPlus,
  Edit,
  Trash2,
  Filter
} from "lucide-react";
import { colaboradoresMock } from "@/data/mockData";
import { Colaborador } from "@/types";
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

const Colaboradores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(colaboradoresMock);
  const [isOpen, setIsOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null);
  
  // Formulário para novo colaborador
  const [novoColaborador, setNovoColaborador] = useState({
    nome: "",
    cargo: "",
    departamento: "",
    telefone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoColaborador({ ...novoColaborador, [name]: value });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredColaboradores = colaboradores.filter((colaborador) => 
    colaborador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colaborador.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    colaborador.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSalvar = () => {
    if (editingColaborador) {
      // Editando colaborador existente
      const updatedColaboradores = colaboradores.map(c => 
        c.id === editingColaborador.id ? {...editingColaborador, ...novoColaborador, email: editingColaborador.email} : c
      );
      setColaboradores(updatedColaboradores);
      toast.success("Colaborador atualizado com sucesso!");
    } else {
      // Adicionando novo colaborador
      const newId = (Math.max(...colaboradores.map(c => parseInt(c.id))) + 1).toString();
      const novoRegistro: Colaborador = {
        id: newId,
        nome: novoColaborador.nome,
        cargo: novoColaborador.cargo,
        departamento: novoColaborador.departamento,
        email: "", // Mantém o campo vazio
        telefone: novoColaborador.telefone,
        dataCadastro: new Date().toISOString().split('T')[0],
        status: "ativo"
      };
      setColaboradores([...colaboradores, novoRegistro]);
      toast.success("Colaborador adicionado com sucesso!");
    }
    
    setNovoColaborador({
      nome: "",
      cargo: "",
      departamento: "",
      telefone: "",
    });
    setEditingColaborador(null);
    setIsOpen(false);
  };

  const handleEditar = (colaborador: Colaborador) => {
    setEditingColaborador(colaborador);
    setNovoColaborador({
      nome: colaborador.nome,
      cargo: colaborador.cargo,
      departamento: colaborador.departamento,
      telefone: colaborador.telefone,
    });
    setIsOpen(true);
  };
  
  const handleExcluir = (id: string) => {
    setColaboradores(colaboradores.filter(c => c.id !== id));
    toast.success("Colaborador excluído com sucesso!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Colaboradores</CardTitle>
              <CardDescription>
                Gerencie os colaboradores da empresa
              </CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Novo Colaborador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingColaborador ? "Editar Colaborador" : "Novo Colaborador"}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os dados do colaborador abaixo
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={novoColaborador.nome}
                        onChange={handleInputChange}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input
                          id="cargo"
                          name="cargo"
                          value={novoColaborador.cargo}
                          onChange={handleInputChange}
                          placeholder="Cargo"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="departamento">Departamento</Label>
                        <Input
                          id="departamento"
                          name="departamento"
                          value={novoColaborador.departamento}
                          onChange={handleInputChange}
                          placeholder="Departamento"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        name="telefone"
                        value={novoColaborador.telefone}
                        onChange={handleInputChange}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      setEditingColaborador(null);
                      setNovoColaborador({
                        nome: "",
                        cargo: "",
                        departamento: "",
                        telefone: "",
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
                placeholder="Buscar colaboradores..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredColaboradores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                      Nenhum colaborador encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredColaboradores.map((colaborador) => (
                    <TableRow key={colaborador.id} className="hover:bg-secondary/50">
                      <TableCell className="font-medium">{colaborador.nome}</TableCell>
                      <TableCell>{colaborador.cargo}</TableCell>
                      <TableCell>{colaborador.departamento}</TableCell>
                      <TableCell>{colaborador.telefone}</TableCell>
                      <TableCell>
                        <Badge variant={colaborador.status === "ativo" ? "outline" : "secondary"} className={
                          colaborador.status === "ativo" 
                            ? "text-green-600 border-green-600" 
                            : "text-gray-500"
                        }>
                          {colaborador.status === "ativo" ? "Ativo" : "Inativo"}
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
                            <DropdownMenuItem onClick={() => handleEditar(colaborador)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleExcluir(colaborador.id)}
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

export default Colaboradores;
