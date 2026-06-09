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

            <th className="p-4 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map((venta) => {
            const total = venta.items.reduce(
              (acum: number, item: any) =>
                acum + item.quantity * item.salePrice,
              0,
            );

            return (
              <tr key={venta.id} className="border-t border-zinc-800">
                <td className="p-4">{venta.invoice || "Sin factura"}</td>

                <td className="p-4">{venta.customer.name}</td>

                <td className="p-4 text-center">{venta.items.length}</td>

                <td className="p-4 text-center">{venta.paymentMethod}</td>

                <td className="p-4 text-center">
                  {venta.paymentMethod === "CREDIT" ? (
                    venta.accountsReceivable?.status === "PAID" ? (
                      <span className="bg-green-600 px-2 py-1 rounded text-xs font-bold">
                        PAGADA
                      </span>
                    ) : (
                      <span className="bg-yellow-600 px-2 py-1 rounded text-xs font-bold">
                        PENDIENTE
                      </span>
                    )
                  ) : (
                    <span className="bg-blue-600 px-2 py-1 rounded text-xs font-bold">
                      CONTADO
                    </span>
                  )}
                </td>

                <td className="p-4 text-right text-yellow-400 font-bold">
                  ${venta.discount.toLocaleString("es-CO")}
                </td>

                <td className="p-4 text-right text-green-400 font-bold">
                  ${total.toLocaleString("es-CO")}
                </td>

                <td className="p-4 text-center">
                  {new Date(venta.createdAt).toLocaleDateString("es-CO")}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/ventas/${venta.id}`}
                      className="bg-yellow-600 px-3 py-2 rounded"
                    >
                      Editar
                    </Link>

                    <Link
                      href={`/ventas/${venta.id}/detalle`}
                      className="bg-blue-600 px-3 py-2 rounded"
                    >
                      Ver
                    </Link>

                    <DeactivateSaleButton saleId={venta.id} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
