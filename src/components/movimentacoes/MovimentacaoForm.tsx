
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { produtosMock, colaboradoresMock, veiculosMock } from "@/data/mockData";
import { Produto, Colaborador, Veiculo } from "@/types";
import { toast } from "sonner";

interface MovimentacaoFormProps {
  onSalvar: (novaMovimentacao: {
    tipo: "entrada" | "saida";
    produtoId: string;
    quantidade: number;
    responsavelId: string;
    observacao: string;
    veiculoId: string;
  }) => void;
  onCancel: () => void;
}

const MovimentacaoForm = ({ onSalvar, onCancel }: MovimentacaoFormProps) => {
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehiclePopoverOpen, setVehiclePopoverOpen] = useState(false);
  
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

  // Ensure filteredVehicles never returns undefined
  const filteredVehicles = vehicleSearch.trim() === "" 
    ? veiculosMock 
    : veiculosMock.filter((veiculo) =>
        veiculo.placa.toLowerCase().includes(vehicleSearch.toLowerCase())
      );

  const handleSubmit = () => {
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

    onSalvar(novaMovimentacao);
  };

  return (
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
                {filteredVehicles && filteredVehicles.length > 0 && (
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

      <div className="flex justify-end gap-3 mt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>Registrar</Button>
      </div>
    </div>
  );
};

export default MovimentacaoForm;
