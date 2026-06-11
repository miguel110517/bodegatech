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

      accountsReceivable: true,

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
      acum + item.quantity * item.salePrice,
    0
  );

  const utilidad = venta.items.reduce(
    (acum, item) =>
      acum +
      (item.salePrice - item.costPrice) *
        item.quantity,
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
                ).toLocaleDateString("es-CO")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 p-5 rounded-xl">
            <p className="text-zinc-400">
              Método de pago
            </p>

            <h2 className="text-xl font-bold">
              {venta.paymentMethod ===
                "CASH" &&
                "Efectivo"}
              {venta.paymentMethod ===
                "TRANSFER" &&
                "Transferencia"}
              {venta.paymentMethod ===
                "CARD" &&
                "Tarjeta"}
              {venta.paymentMethod ===
                "CREDIT" &&
                "Crédito"}
              {venta.paymentMethod ===
                "MIXED" &&
                "Mixto"}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p className="text-zinc-400">
              Subtotal
            </p>

            <h2 className="text-xl font-bold">
              $
              {venta.subtotal.toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p className="text-zinc-400">
              Descuento
            </p>

            <h2 className="text-xl font-bold text-yellow-400">
              $
              {venta.discount.toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p className="text-zinc-400">
              Total Final
            </p>

            <h2 className="text-xl font-bold text-green-400">
              $
              {venta.total.toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Distribución del Pago
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {venta.cashAmount > 0 && (
              <div>
                <span className="text-zinc-400">
                  Efectivo:
                </span>{" "}
                $
                {venta.cashAmount.toLocaleString(
                  "es-CO"
                )}
              </div>
            )}

            {venta.transferAmount >
              0 && (
              <div>
                <span className="text-zinc-400">
                  Transferencia:
                </span>{" "}
                $
                {venta.transferAmount.toLocaleString(
                  "es-CO"
                )}
              </div>
            )}

            {venta.cardAmount > 0 && (
              <div>
                <span className="text-zinc-400">
                  Tarjeta:
                </span>{" "}
                $
                {venta.cardAmount.toLocaleString(
                  "es-CO"
                )}
              </div>
            )}

            {venta.creditAmount > 0 && (
              <div>
                <span className="text-zinc-400">
                  Crédito:
                </span>{" "}
                $
                {venta.creditAmount.toLocaleString(
                  "es-CO"
                )}
              </div>
            )}
          </div>
        </div>

        {venta.accountsReceivable && (
          <div className="bg-zinc-900 p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Cuenta por Cobrar
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-zinc-400">
                  Estado
                </p>

                <p className="font-bold">
                  {
                    venta
                      .accountsReceivable
                      .status
                  }
                </p>
              </div>

              <div>
                <p className="text-zinc-400">
                  Pendiente
                </p>

                <p className="font-bold text-yellow-400">
                  $
                  {venta.accountsReceivable.pendingAmount.toLocaleString(
                    "es-CO"
                  )}
                </p>
              </div>

              <div>
                <p className="text-zinc-400">
                  Pagado
                </p>

                <p className="font-bold text-green-400">
                  $
                  {venta.accountsReceivable.paidAmount.toLocaleString(
                    "es-CO"
                  )}
                </p>
              </div>

              <div>
                <p className="text-zinc-400">
                  Fecha límite
                </p>

                <p className="font-bold">
                  {venta
                    .accountsReceivable
                    .dueDate
                    ? new Date(
                        venta
                          .accountsReceivable
                          .dueDate
                      ).toLocaleDateString(
                        "es-CO"
                      )
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        )}

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
              {total.toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Utilidad</p>

            <h2 className="text-3xl font-bold text-blue-400">
              $
              {utilidad.toLocaleString(
                "es-CO"
              )}
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
                      {
                        item.product
                          .name
                      }
                    </td>

                    <td className="p-4 text-center">
                      {item.quantity}
                    </td>

                    <td className="p-4 text-right">
                      $
                      {item.costPrice.toLocaleString(
                        "es-CO"
                      )}
                    </td>

                    <td className="p-4 text-right">
                      $
                      {item.salePrice.toLocaleString(
                        "es-CO"
                      )}
                    </td>

                    <td className="p-4 text-right text-green-400 font-bold">
                      $
                      {(
                        item.quantity *
                        item.salePrice
                      ).toLocaleString(
                        "es-CO"
                      )}
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