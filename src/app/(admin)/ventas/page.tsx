
import { prisma } from "@/lib/prisma";
import { createSale } from "./actions/create-sale";
import { deleteSale } from "./actions/delete-sale";
import SaleForm from "./components/sale-form";

export default async function VentasPage() {
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

  const ventas = await prisma.sale.findMany({
    include: {
      customer: true,
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
          Ventas
        </h1>

        <form
          action={createSale}
          className="bg-zinc-900 p-6 rounded-xl mb-10"
        >

          <div className="grid md:grid-cols-2 gap-4 mb-6">

            <select
              name="customerId"
              className="p-3 rounded bg-zinc-800"
              required
            >
              <option value="">
                Seleccione cliente
              </option>

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
              placeholder="Factura"
              className="p-3 rounded bg-zinc-800"
            />

          </div>

          <SaleForm productos={productos} />

          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded mt-6"
          >
            Registrar Venta
          </button>

        </form>

        <div className="space-y-4">

          {ventas.map((venta) => {

            const total = venta.items.reduce(
              (acum, item) =>
                acum +
                item.quantity *
                item.salePrice,
              0
            );

            return (
              <div
                key={venta.id}
                className="bg-zinc-900 p-5 rounded-xl border border-zinc-800"
              >

                <h2 className="text-xl font-bold">
                  Factura: {venta.invoice || "-"}
                </h2>

                <p className="text-zinc-400">
                  Cliente: {venta.customer.name}
                </p>

                <div className="mt-4">

                  {venta.items.map((item) => (
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
                        Precio: ${item.salePrice}
                      </p>
                    </div>
                  ))}

                </div>

                <div className="mt-4">

                  <p className="text-green-400 font-bold">
                    Total: ${total}
                  </p>

                </div>

                <div className="flex gap-3 mt-4">

                  <a
                    href={`/ventas/${venta.id}`}
                    className="bg-yellow-600 px-4 py-2 rounded"
                  >
                    Editar
                  </a>

                  <form
                    action={async () => {
                      "use server";
                      await deleteSale(venta.id);
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
