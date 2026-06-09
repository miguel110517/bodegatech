import { prisma } from "@/lib/prisma";
import { ActivateSaleButton } from "../components/activate-sale-button";

export default async function VentasDesactivadasPage() {
  const ventas = await prisma.sale.findMany({
    where: {
      active: false,
    },

    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      deletedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-8">

          <h1 className="text-4xl font-bold">
            Ventas Desactivadas
          </h1>

          <a
            href="/ventas"
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
          >
            ← Volver a Ventas
          </a>

        </div>

        {ventas.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
            <p className="text-xl font-semibold">
              No hay ventas desactivadas
            </p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

            <table className="w-full">

              <thead className="bg-zinc-800">
                <tr>
                  <th className="text-left p-4">
                    Factura
                  </th>

                  <th className="text-left p-4">
                    Cliente
                  </th>

                  <th className="text-left p-4">
                    Productos
                  </th>

                  <th className="text-left p-4">
                    Total
                  </th>

                  <th className="text-left p-4">
                    Fecha
                  </th>

                  <th className="text-left p-4">
                    Estado
                  </th>

                  <th className="text-left p-4">
                    Detalle
                  </th>

                  <th className="text-left p-4">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>

                {ventas.map((venta) => {

                  const total = venta.items.reduce(
                    (acum, item) =>
                      acum +
                      item.quantity *
                      item.salePrice,
                    0
                  );

                  return (
                    <tr
                      key={venta.id}
                      className="border-t border-zinc-800"
                    >
                      <td className="p-4 font-medium">
                        {venta.invoice}
                      </td>

                      <td className="p-4">
                        {venta.customer.name}
                      </td>

                      <td className="p-4">
                        {venta.items.length}
                      </td>

                      <td className="p-4 text-green-400 font-bold">
                        $
                        {total.toLocaleString("es-CO")}
                      </td>

                      <td className="p-4 text-zinc-400">
                        {new Date(
                          venta.createdAt
                        ).toLocaleDateString("es-CO")}
                      </td>

                      <td className="p-4">
                        <span className="bg-red-600 px-3 py-1 rounded text-sm">
                          Desactivada
                        </span>
                      </td>

                      <td className="p-4">
                        <a
                          href={`/ventas/${venta.id}/detalle`}
                          className="bg-blue-600 px-3 py-2 rounded"
                        >
                          Ver
                        </a>
                      </td>

                      <td className="p-4">
                        <ActivateSaleButton
                          saleId={venta.id}
                        />
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </main>
  );
}