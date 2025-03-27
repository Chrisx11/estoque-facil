
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  TrendingUp, 
  BarChart4, 
  PieChart,
  Download
} from "lucide-react";
import { 
  dashboardData, 
  produtosMock, 
  movimentacoesMock 
} from "@/data/mockData";
import { BarChart } from "@/components/ui/chart";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Relatorios = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("mensal");
  
  // Dados para o gráfico de entradas e saídas por mês
  const movimentacoesMensais = [
    { name: 'Jan', entradas: 12, saidas: 8 },
    { name: 'Fev', entradas: 15, saidas: 10 },
    { name: 'Mar', entradas: 18, saidas: 12 },
    { name: 'Abr', entradas: 20, saidas: 15 },
    { name: 'Mai', entradas: 22, saidas: 18 },
    { name: 'Jun', entradas: 25, saidas: 20 },
  ];
  
  // Dados para o gráfico de produtos mais movimentados
  const produtosMaisMovimentados = [
    { name: 'Papel A4', quantidade: 50 },
    { name: 'Caneta Esfer.', quantidade: 35 },
    { name: 'Teclado USB', quantidade: 15 },
    { name: 'Monitor 24"', quantidade: 8 },
    { name: 'Mesa Escrit.', quantidade: 4 },
  ];
  
  const handleExportarRelatorio = (tipo: string) => {
    toast.success(`Relatório de ${tipo} exportado com sucesso!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Relatório de movimentações */}
        <Card className="glass-card card-hover">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Movimentações</CardTitle>
                <CardDescription>Entradas e saídas de produtos</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1.5"
                onClick={() => handleExportarRelatorio("movimentações")}
              >
                <Download className="h-3.5 w-3.5" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">Visualização por período</p>
              <Select 
                defaultValue={periodoSelecionado} 
                onValueChange={setPeriodoSelecionado}
              >
                <SelectTrigger className="w-[160px] h-8">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="h-[250px] w-full">
              <BarChart 
                data={movimentacoesMensais}
                index="name"
                categories={["entradas", "saidas"]}
                colors={["#4f46e5", "#0ea5e9"]}
                valueFormatter={(value) => `${value} itens`}
                yAxisWidth={30}
                className="h-[250px]"
              />
            </div>
            
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary"></div>
                <p className="text-xs text-muted-foreground">Entradas</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                <p className="text-xs text-muted-foreground">Saídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Relatório de produtos mais movimentados */}
        <Card className="glass-card card-hover">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Produtos Mais Movimentados</CardTitle>
                <CardDescription>Top 5 produtos com mais movimentações</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1.5"
                onClick={() => handleExportarRelatorio("produtos mais movimentados")}
              >
                <Download className="h-3.5 w-3.5" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <BarChart 
                data={produtosMaisMovimentados}
                index="name"
                categories={["quantidade"]}
                colors={["#8b5cf6"]}
                layout="vertical"
                valueFormatter={(value) => `${value} unid.`}
                className="h-[250px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Relatório de produtos com baixo estoque */}
      <Card className="glass-card card-hover">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Produtos com Baixo Estoque</CardTitle>
              <CardDescription>
                Produtos que precisam de reposição
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="gap-1.5"
              onClick={() => handleExportarRelatorio("produtos com baixo estoque")}
            >
              <Download className="h-3.5 w-3.5" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left text-sm font-medium">Produto</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Código</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Categoria</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Estoque Atual</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Estoque Mínimo</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.produtosBaixoEstoque.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 px-4 text-center text-sm text-muted-foreground">
                      Não há produtos com baixo estoque
                    </td>
                  </tr>
                ) : (
                  dashboardData.produtosBaixoEstoque.map((produto) => (
                    <tr key={produto.id} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4 text-sm font-medium">{produto.nome}</td>
                      <td className="py-3 px-4 text-sm">{produto.codigo}</td>
                      <td className="py-3 px-4 text-sm">{produto.categoria}</td>
                      <td className="py-3 px-4 text-sm">{produto.quantidadeAtual} {produto.unidade}</td>
                      <td className="py-3 px-4 text-sm">{produto.quantidadeMinima} {produto.unidade}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge 
                          variant={produto.quantidadeAtual === 0 ? "destructive" : "outline"}
                          className={produto.quantidadeAtual === 0 ? "" : "text-amber-500 border-amber-500"}
                        >
                          {produto.quantidadeAtual === 0 ? "Sem estoque" : "Baixo estoque"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Lista de relatórios disponíveis */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>
            Exporte relatórios detalhados em diferentes formatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleExportarRelatorio("inventário atual")}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Inventário Atual</h3>
                  <p className="text-sm text-muted-foreground">
                    Lista completa de todos os produtos em estoque
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleExportarRelatorio("movimentações por período")}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Movimentações por Período</h3>
                  <p className="text-sm text-muted-foreground">
                    Entradas e saídas de produtos por período
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleExportarRelatorio("giro de estoque")}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart4 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Giro de Estoque</h3>
                  <p className="text-sm text-muted-foreground">
                    Análise de giro de estoque por produto
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleExportarRelatorio("pedidos por status")}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Pedidos por Status</h3>
                  <p className="text-sm text-muted-foreground">
                    Resumo de pedidos por status (pendente, aprovado, etc.)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;
