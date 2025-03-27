
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname;
    
    if (path === "/") {
      setPageTitle("Dashboard");
    } else if (path.includes("/colaboradores")) {
      setPageTitle("Colaboradores");
    } else if (path.includes("/produtos")) {
      setPageTitle("Produtos");
    } else if (path.includes("/movimentacoes")) {
      setPageTitle("Entradas e Saídas");
    } else if (path.includes("/veiculos")) {
      setPageTitle("Veículos");
    } else if (path.includes("/pedidos")) {
      setPageTitle("Pedidos de Compra");
    } else if (path.includes("/relatorios")) {
      setPageTitle("Relatórios");
    }
  }, [location]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <div className="flex items-center p-4 h-16 border-b">
            <SidebarTrigger />
            <h1 className="ml-4 text-xl font-medium">{pageTitle}</h1>
          </div>
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
