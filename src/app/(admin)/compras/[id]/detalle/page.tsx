import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetalleCompraPage({
  params,
}: Props) {
  const { id } = await params;

  const compra = await prisma.purchase.findUnique({
    where: {
      id,
    },

    include: {
      provider: true,

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

  const total = compra.items.reduce(
    (acum, item) =>
      acum +
      item.quantity *
      item.costPrice,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Detalle de Compra
          </h1>

          <a
            href="/compras"
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
          >
            ← Volver
          </a>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <p className="text-zinc-400">
                Factura
              </p>

              <p className="font-bold text-xl">
                {compra.invoice}
              </p>
            </div>

            <div>
              <p className="text-zinc-400">
                Proveedor
              </p>

              <p className="font-bold text-xl">
                {compra.provider.name}
              </p>
            </div>

            <div>
              <p className="text-zinc-400">
                Fecha
              </p>

              <p>
                {new Date(
                  compra.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-zinc-400">
                Productos
              </p>

              <p>
                {compra.items.length}
              </p>
            </div>

          </div>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

          <table className="w-full">
            <thead className="bg-zinc-800">
              <tr>
                <th className="text-left p-4">
                  Producto
                </th>

                <th className="text-left p-4">
                  Cantidad
                </th>

                <th className="text-left p-4">
                  Costo
                </th>

                <th className="text-left p-4">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody>

              {compra.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-zinc-800"
                >
                  <td className="p-4">
                    {item.product.name}
                  </td>

                  <td className="p-4">
                    {item.quantity}
                  </td>

                  <td className="p-4">
                    ${item.costPrice}
                  </td>

                  <td className="p-4 text-green-400 font-bold">
                    $
                    {item.quantity *
                      item.costPrice}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>

        </div>

        <div className="mt-6 flex justify-end">

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

            <p className="text-zinc-400 mb-2">
              Total de la Compra
            </p>

            <p className="text-3xl font-bold text-green-400">
              ${total}
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}