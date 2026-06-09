import { prisma } from "@/lib/prisma";
import SaleForm from "./components/sale-form";
import SalesTable from "./components/sales-table";
export default async function VentasPage() {
  const clientes = await prisma.customer.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const productos = await prisma.product.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      salePrice: true,
      stock: true,
    },
    orderBy: {
      name: "asc",
    },
  });

 const ventas = await prisma.sale.findMany({
  where: {
    active: true,
  },
  include: {
    customer: true,

    accountsReceivable: true,

    items: {
      include: {
        product: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Ventas
          </h1>

          <a
            href="/ventas/desactivadas"
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Ventas Desactivadas
          </a>
        </div>

        <SaleForm
          productos={productos}
          clientes={clientes}
        />

        <SalesTable
          ventas={ventas}
        />

      </div>
    </main>
  );
}