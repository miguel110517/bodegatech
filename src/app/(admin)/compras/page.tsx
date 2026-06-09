import { prisma } from "@/lib/prisma";
import { createPurchase } from "./actions/create-purchase";
import { DeactivatePurchaseButton } from "./components/deactivate-purchase-button";
import { PurchasesTable } from "./components/purchases-table";
import PurchaseForm from "./components/purchase-form";

export default async function ComprasPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const params = await searchParams;

  const search = params.q?.trim() || "";

  const proveedores = await prisma.provider.findMany({
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
      stock: true,
      imageUrl: true,
    },

    orderBy: {
      name: "asc",
    },
  });

  const compras = await prisma.purchase.findMany({
    where: {
      active: true,

      OR: [
        {
          invoice: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          provider: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    },

    include: {
      provider: true,
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

        <h1 className="text-4xl font-bold mb-8">
          Compras
        </h1>

        <div className="mb-6">
          <a
            href="/compras/desactivadas" 
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
           >
            Compras Desactivadas
          </a>
        </div>

        <PurchaseForm
          productos={productos}
          proveedores={proveedores}
          action={createPurchase}
        />

        <PurchasesTable compras={compras} />

      </div>
    </main>
  );
}