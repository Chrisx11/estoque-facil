
import { Movimentacao } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MovimentacoesListProps {
  movimentacoes: Movimentacao[];
}

const MovimentacoesList = ({ movimentacoes }: MovimentacoesListProps) => {
  return (
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
          {movimentacoes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                Nenhuma movimentação encontrada
              </TableCell>
            </TableRow>
          ) : (
            movimentacoes.map((movimentacao) => (
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
  );
};

export default MovimentacoesList;
