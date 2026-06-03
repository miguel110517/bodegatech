import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  DollarSign,
  Users,
  Truck,
  Receipt,
  BarChart3,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Productos",
      href: "/productos",
      icon: Package,
    },
    {
      name: "Categorías",
      href: "/categorias",
      icon: Tags,
    },
    {
      name: "Compras",
      href: "/compras",
      icon: ShoppingCart,
    },
    {
      name: "Ventas",
      href: "/ventas",
      icon: DollarSign,
    },
    {
      name: "Clientes",
      href: "/clientes",
      icon: Users,
    },
    {
      name: "Proveedores",
      href: "/proveedores",
      icon: Truck,
    },
    {
      name: "Gastos",
      href: "/gastos",
      icon: Receipt,
    },
    {
      name: "Finanzas",
      href: "/finanzas",
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">

      {/* SIDEBAR */}

      <aside className="w-72 border-r border-zinc-800 bg-zinc-900">

        <div className="p-6 border-b border-zinc-800">

          <h1 className="text-2xl font-bold text-blue-500">
            Bodega Tech
          </h1>

          <p className="text-zinc-500 text-sm mt-1">
            ERP Empresarial
          </p>

        </div>

        <nav className="p-4 space-y-2">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  text-zinc-300
                  hover:bg-zinc-800
                  hover:text-white
                  transition
                "
              >
                <Icon size={18} />

                <span>
                  {item.name}
                </span>

              </Link>
            );
          })}

        </nav>

      </aside>

      {/* CONTENIDO */}

      <div className="flex-1 flex flex-col">

        <header className="
          h-16
          border-b
          border-zinc-800
          bg-zinc-900
          flex
          items-center
          justify-between
          px-8
        ">

          <div>

            <h2 className="font-semibold text-lg">
              Panel Administrativo
            </h2>

          </div>

          <div className="flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-full
              bg-blue-600
              flex
              items-center
              justify-center
              font-bold
            ">
              M
            </div>

          </div>

        </header>

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}