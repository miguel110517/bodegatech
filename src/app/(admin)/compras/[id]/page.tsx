import { prisma } from "@/lib/prisma";
import { updatePurchase } from "../actions/update-purchase";
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
    notFound();
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

        <h1 className="text-4xl font-bold mb-8">
          Editar Compra
        </h1>

        <form
          action={async (formData) => {
            "use server";
            await updatePurchase(id, formData);
          }}
          className="bg-zinc-900 p-6 rounded-xl"
        >

          <div className="grid md:grid-cols-2 gap-4 mb-6">

            <input
              name="invoice"
              defaultValue={compra.invoice ?? ""}
              placeholder="Factura"
              className="p-3 rounded bg-zinc-800"
            />

            <select
              name="providerId"
              defaultValue={compra.providerId}
              className="p-3 rounded bg-zinc-800"
              required
            >
              {proveedores.map((proveedor) => (
                <option
                  key={proveedor.id}
                  value={proveedor.id}
                >
                  {proveedor.name}
                </option>
              ))}
            </select>

          </div>

          {compra.items.map((item) => (
            <div
              key={item.id}
              className="grid md:grid-cols-3 gap-4 mb-4"
            >

              <select
                name="productId"
                defaultValue={item.productId}
                className="p-3 rounded bg-zinc-800"
                required
              >
                {productos.map((producto) => (
                  <option
                    key={producto.id}
                    value={producto.id}
                  >
                    {producto.name}
                  </option>
                ))}
              </select>

              <input
                name="quantity"
                type="number"
                defaultValue={item.quantity}
                className="p-3 rounded bg-zinc-800"
                required
              />

              <input
                name="costPrice"
                type="number"
                step="0.01"
                defaultValue={item.costPrice}
                className="p-3 rounded bg-zinc-800"
                required
              />

            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded mt-4"
          >
            Guardar Cambios
          </button>

        </form>

      </div>
    </main>
  );
}