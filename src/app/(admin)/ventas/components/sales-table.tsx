import Link from "next/link";
import { DeactivateSaleButton } from "./deactivate-sale-button";

type Props = {
  ventas: any[];
};

export default function SalesTable({ ventas }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-zinc-900 rounded-xl overflow-hidden">
        <thead className="bg-zinc-800">
          <tr>
            <th className="p-4 text-left">Factura</th>

            <th className="p-4 text-left">Cliente</th>

            <th className="p-4 text-center">Productos</th>

            <th className="p-4 text-center">Método</th>

            <th className="p-4 text-center">Estado</th>

            <th className="p-4 text-right">Descuento</th>

            <th className="p-4 text-right">Total</th>

            <th className="p-4 text-center">Fecha</th>

            <th className="p-4 text-center w-24">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {ventas.map((venta) => (
            <tr
              key={venta.id}
              className="border-t border-zinc-800 hover:bg-zinc-800/40"
            >
              <td className="p-4 whitespace-nowrap font-medium">
                {venta.invoice || "Sin factura"}
              </td>

              <td className="p-4 whitespace-nowrap">
                {venta.customer.name}
              </td>

              <td className="p-4 text-center">
                {venta.items.length}
              </td>

              <td className="p-4 text-center">
                {venta.paymentMethod === "CASH" && "Efectivo"}
                {venta.paymentMethod === "TRANSFER" && "Transferencia"}
                {venta.paymentMethod === "CARD" && "Tarjeta"}
                {venta.paymentMethod === "CREDIT" && "Crédito"}
                {venta.paymentMethod === "MIXED" && "Mixto"}
              </td>

              <td className="p-4 text-center">
                {venta.paymentMethod === "CREDIT" ? (
                  venta.accountsReceivable?.status === "PAID" ? (
                    <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-bold">
                      PAGADA
                    </span>
                  ) : (
                    <span className="bg-yellow-600 px-3 py-1 rounded-full text-xs font-bold">
                      PENDIENTE
                    </span>
                  )
                ) : venta.paymentMethod === "MIXED" ? (
                  venta.creditAmount > 0 ? (
                    <span className="bg-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                      PENDIENTE
                    </span>
                  ) : (
                    <span className="bg-cyan-600 px-3 py-1 rounded-full text-xs font-bold">
                      MIXTO
                    </span>
                  )
                ) : (
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                    CONTADO
                  </span>
                )}
              </td>

              <td className="p-4 text-right text-yellow-400 font-semibold whitespace-nowrap">
                $
                {venta.discount.toLocaleString(
                  "es-CO",
                )}
              </td>

              <td className="p-4 text-right text-green-400 font-bold whitespace-nowrap">
                $
                {venta.total.toLocaleString(
                  "es-CO",
                )}
              </td>

              <td className="p-4 text-center whitespace-nowrap">
                {new Date(
                  venta.createdAt,
                ).toLocaleDateString("es-CO")}
              </td>

              <td className="p-4">
                <div className="flex justify-center gap-1">
                  <Link
                    href={`/ventas/${venta.id}`}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-sm"
                    title="Editar"
                  >
                    ✏️
                  </Link>

                  <Link
                    href={`/ventas/${venta.id}/detalle`}
                    className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm"
                    title="Ver"
                  >
                    👁️
                  </Link>

                  <DeactivateSaleButton
                    saleId={venta.id}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}