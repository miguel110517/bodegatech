import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateSale } from "../actions/update-sale";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarVentaPage({
  params,
}: Props) {
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
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Editar Venta
        </h1>

        <form
          action={async (formData) => {
            "use server";
            await updateSale(id, formData);
          }}
          className="bg-zinc-900 p-6 rounded-xl"
        >

          <div className="grid md:grid-cols-2 gap-4 mb-6">

            <select
              name="customerId"
              defaultValue={venta.customerId}
              className="p-3 rounded bg-zinc-800"
              required
            >
              {clientes.map((cliente) => (
                <option
                  key={cliente.id}
                  value={cliente.id}
                >
                  {cliente.name}
                </option>
              ))}
            </select>

            <input
              name="invoice"
              defaultValue={venta.invoice ?? ""}
              placeholder="Factura"
              className="p-3 rounded bg-zinc-800"
            />

          </div>

          {venta.items.map((item) => (
            <div
              key={item.id}
              className="grid md:grid-cols-2 gap-4 mb-4"
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