
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  Package, 
  Users, 
  Truck, 
  AlertCircle, 
  ShoppingCart 
} from "lucide-react";
import { dashboardData, movimentacoesMock } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card de Total de Produtos */}
        <Card className="glass-card card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalProdutos}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Total de Colaboradores */}
        <Card className="glass-card card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Colaboradores</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalColaboradores}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Total de Veículos */}
        <Card className="glass-card card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Veículos</p>
                <h3 className="text-2xl font-bold">{dashboardData.totalVeiculos}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card de Produtos com Baixo Estoque */}
        <Card className="glass-card animate-slide-in-bottom card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Produtos com Baixo Estoque</CardTitle>
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <CardDescription>
              Produtos abaixo do nível mínimo de estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.produtosBaixoEstoque.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Não há produtos com estoque baixo
              </p>
            ) : (
              <div className="space-y-4">
                {dashboardData.produtosBaixoEstoque.map((produto) => (
                  <div key={produto.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{produto.nome}</span>
                      <Badge 
                        variant={produto.quantidadeAtual === 0 ? "destructive" : "outline"}
                        className={produto.quantidadeAtual === 0 ? "" : "text-amber-500 border-amber-500"}
                      >
                        {produto.quantidadeAtual === 0 
                          ? "Sem estoque" 
                          : `${produto.quantidadeAtual} unidades`}
                      </Badge>
                    </div>
                    <Progress 
                      value={(produto.quantidadeAtual / produto.quantidadeMinima) * 100} 
                      className="h-2" 
                    />
                    <Separator className="my-1" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Pedidos Pendentes */}
        <Card className="glass-card animate-slide-in-bottom card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pedidos Pendentes</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
            </div>
            <CardDescription>
              Pedidos de compra aguardando aprovação
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.totalPedidosPendentes === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Não há pedidos pendentes
              </p>
            ) : (
              <div className="space-y-4">
                {dashboardData.ultimosPedidos
                  .filter((pedido) => pedido.status === "pendente")
                  .map((pedido) => (
                    <div key={pedido.id} className="p-3 rounded-md bg-secondary/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{pedido.numeroPedido}</span>
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          Pendente
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Solicitante: {pedido.solicitante.nome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Data: {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Itens: </span>
                        {pedido.itens.length}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Últimas Movimentações */}
      <Card className="glass-card animate-slide-in-bottom card-hover">
        <CardHeader>
          <CardTitle>Últimas Movimentações</CardTitle>
          <CardDescription>
            Entradas e saídas recentes de produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.ultimasMovimentacoes.map((movimentacao) => (
              <div key={movimentacao.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    movimentacao.tipo === 'entrada' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {movimentacao.tipo === 'entrada' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="font-medium">{movimentacao.produto.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {movimentacao.responsavel.nome} • {' '}
                      {new Date(movimentacao.dataMovimentacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {movimentacao.quantidade} {movimentacao.produto.unidade}
                  </p>
                  <Badge variant={movimentacao.tipo === 'entrada' ? 'outline' : 'secondary'} className={`
                    ${movimentacao.tipo === 'entrada' 
                      ? 'text-green-600 border-green-600' 
                      : 'text-blue-600 border-blue-600'
                    }
                  `}>
                    {movimentacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
