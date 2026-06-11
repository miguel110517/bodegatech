import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateSale } from "../actions/update-sale";
import EditSaleForm from "./components/EditSaleForm";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarVentaPage({ params }: Props) {
  const { id } = await params;

  const venta = await prisma.sale.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!venta) {
    notFound();
  }

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
    code: true,
    name: true,
    brand: true,
    salePrice: true,
    offerPrice: true,
    stock: true,
  },
  orderBy: {
    name: "asc",
  },
});
  return (
    <main className="min-h-screen bg-black text-white p-10">
    <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Editar Venta</h1>

          <a
            href="/ventas"
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
          >
            ← Volver a Ventas
          </a>
        </div>

        <EditSaleForm venta={venta} clientes={clientes} productos={productos} />
      </div>
    </main>
  );
}
