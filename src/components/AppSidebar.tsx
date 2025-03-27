
import {
  BarChart,
  Users,
  Package,
  RefreshCw,
  Truck,
  ShoppingCart,
  FileText,
  LogOut,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    icon: BarChart,
    path: "/",
  },
  {
    title: "Colaboradores",
    icon: Users,
    path: "/colaboradores",
  },
  {
    title: "Produtos",
    icon: Package,
    path: "/produtos",
  },
  {
    title: "Entradas e Saídas",
    icon: RefreshCw,
    path: "/movimentacoes",
  },
  {
    title: "Veículos",
    icon: Truck,
    path: "/veiculos",
  },
  {
    title: "Pedidos de Compra",
    icon: ShoppingCart,
    path: "/pedidos",
  },
  {
    title: "Relatórios",
    icon: FileText,
    path: "/relatorios",
  },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex justify-center items-center border-b">
        <h1 className="text-xl font-bold text-primary">Estoque Fácil</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "flex items-center gap-3 rounded-md p-2 transition-colors",
                        location.pathname === item.path 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">Configurações</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 cursor-pointer">
            <LogOut className="h-4 w-4" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
