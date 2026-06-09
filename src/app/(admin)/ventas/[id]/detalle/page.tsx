import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetalleVentaPage({
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

  const total = venta.items.reduce(
    (acum, item) =>
      acum +
      item.quantity *
        item.salePrice,
    0
  );

  const utilidad = venta.items.reduce(
    (acum, item) =>
      acum +
      (
        (item.salePrice -
          item.costPrice) *
        item.quantity
      ),
    0
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">

        <a
          href="/ventas"
          className="
            inline-block
            bg-zinc-800
            hover:bg-zinc-700
            px-4
            py-2
            rounded-xl
            transition
            mb-6
          "
        >
          ← Volver a Ventas
        </a>

        <h1 className="text-4xl font-bold mb-8">
          Detalle de Venta
        </h1>

        <div className="bg-zinc-900 p-6 rounded-xl mb-8">

          <div className="grid md:grid-cols-3 gap-4">

            <div>
              <p className="text-zinc-400">
                Factura
              </p>

              <p className="font-bold">
                {venta.invoice ||
                  "Sin factura"}
              </p>
            </div>

            <div>
              <p className="text-zinc-400">
                Cliente
              </p>

              <p className="font-bold">
                {venta.customer.name}
              </p>
            </div>

            <div>
              <p className="text-zinc-400">
                Fecha
              </p>

              <p className="font-bold">
                {new Date(
                  venta.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Total Productos</p>

            <h2 className="text-3xl font-bold text-yellow-400">
              {venta.items.length}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Total Venta</p>

            <h2 className="text-3xl font-bold text-green-400">
              $
              {total.toLocaleString()}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Utilidad</p>

            <h2 className="text-3xl font-bold text-blue-400">
              $
              {utilidad.toLocaleString()}
            </h2>
          </div>

        </div>

        <div className="bg-zinc-900 rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-zinc-800">

              <tr>
                <th className="p-4 text-left">
                  Producto
                </th>

                <th className="p-4 text-center">
                  Cantidad
                </th>

                <th className="p-4 text-right">
                  Costo
                </th>

                <th className="p-4 text-right">
                  Venta
                </th>

                <th className="p-4 text-right">
                  Subtotal
                </th>

              </tr>

            </thead>

            <tbody>

              {venta.items.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-t border-zinc-800"
                  >
                    <td className="p-4">
                      {item.product.name}
                    </td>

                    <td className="p-4 text-center">
                      {item.quantity}
                    </td>

                    <td className="p-4 text-right">
                      $
                      {item.costPrice.toLocaleString()}
                    </td>

                    <td className="p-4 text-right">
                      $
                      {item.salePrice.toLocaleString()}
                    </td>

                    <td className="p-4 text-right text-green-400 font-bold">
                      $
                      {(
                        item.quantity *
                        item.salePrice
                      ).toLocaleString()}
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}