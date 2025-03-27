
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 text-center animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <FileQuestion className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          A página que você está tentando acessar não existe ou foi movida.
        </p>
        <Link to="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
