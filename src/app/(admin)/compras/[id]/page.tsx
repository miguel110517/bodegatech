import { prisma } from "@/lib/prisma";
import { updatePurchase } from "../actions/update-purchase";
import EditPurchaseForm from "../components/edit-purchase-form";
import BackButton from "../components/back-button";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarCompraPage({
  params,
}: Props) {
  const { id } = await params;

  const compra = await prisma.purchase.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!compra) {
    return (
      <div className="p-10 text-white">
        Compra no encontrada: {id}
      </div>
    );
  }

  const proveedores = await prisma.provider.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const productos = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-4">
          Editar Compra #{compra.invoice}
        </h1>

        <div className="mb-6">
          <BackButton />
        </div>

        <div className="bg-zinc-900 rounded-xl p-4 mb-6 border border-zinc-800">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-zinc-400 text-sm">
                Factura
              </p>
              <p className="font-bold">
                {compra.invoice || "Sin factura"}
              </p>
            </div>

            <div>
              <p className="text-zinc-400 text-sm">
                Fecha
              </p>
              <p className="font-bold">
                {new Date(
                  compra.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-zinc-400 text-sm">
                Productos
              </p>
              <p className="font-bold">
                {compra.items.length}
              </p>
            </div>
          </div>
        </div>

        <EditPurchaseForm
          compra={compra}
          productos={productos}
          proveedores={proveedores}
          action={async (formData) => {
            "use server";
            await updatePurchase(id, formData);
          }}
        />
      </div>
    </main>
  );
}