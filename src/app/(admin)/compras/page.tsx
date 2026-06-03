import { prisma } from "@/lib/prisma";
import { createPurchase } from "./actions/create-purchase";
import { deletePurchase } from "./actions/delete-purchase";
import PurchaseForm from "./components/purchase-form";

export default async function ComprasPage() {
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

  const compras = await prisma.purchase.findMany({
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

        <PurchaseForm
          productos={productos}
          proveedores={proveedores}
          action={createPurchase}
        />

        <div className="space-y-4">

          {compras.map((compra) => {

            const total = compra.items.reduce(
              (acum, item) =>
                acum +
                item.quantity *
                item.costPrice,
              0
            );

            return (
              <div
                key={compra.id}
                className="bg-zinc-900 p-5 rounded-xl border border-zinc-800"
              >
                <h2 className="text-xl font-bold">
                  Factura: {compra.invoice || "-"}
                </h2>

                <p className="text-zinc-400">
                  Proveedor: {compra.provider.name}
                </p>

                <div className="mt-4">

                  {compra.items.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-zinc-700 py-2"
                    >
                      <p>
                        {item.product.name}
                      </p>

                      <p className="text-sm text-zinc-400">
                        Cantidad: {item.quantity}
                      </p>

                      <p className="text-sm text-zinc-400">
                        Costo: ${item.costPrice}
                      </p>
                    </div>
                  ))}

                </div>

                <p className="text-green-400 font-bold mt-4">
                  Total: ${total}
                </p>

                <div className="flex gap-3 mt-4">

                  <a
                    href={`/compras/${compra.id}`}
                    className="bg-yellow-600 px-4 py-2 rounded"
                  >
                    Editar
                  </a>

                  <form
                    action={async () => {
                      "use server";
                      await deletePurchase(compra.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-red-600 px-4 py-2 rounded"
                    >
                      Eliminar
                    </button>
                  </form>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </main>
  );
}