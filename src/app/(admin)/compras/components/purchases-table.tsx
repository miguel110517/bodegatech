"use client";

import { useState } from "react";
import { DeactivatePurchaseButton } from "./deactivate-purchase-button";

export function PurchasesTable({
  compras,
}: any) {
  const [search, setSearch] = useState("");

  const filteredPurchases =
    compras.filter((compra: any) => {
      const text =
        search.toLowerCase();

      return (
        compra.invoice
          ?.toLowerCase()
          .includes(text) ||

        compra.provider.name
          .toLowerCase()
          .includes(text)
      );
    });

  return (
    <div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por factura o proveedor..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 outline-none focus:border-blue-500 transition"
        />
      </div>

      {filteredPurchases.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
          <p className="text-2xl font-bold">
            Compra no encontrada
          </p>

          <p className="text-zinc-400 mt-2">
            No existe ninguna compra con ese proveedor o factura.
          </p>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-zinc-800">

            <tr>

              <th className="p-4 text-left">
                Factura
              </th>

              <th className="p-4 text-left">
                Proveedor
              </th>

              <th className="p-4 text-left">
                Productos
              </th>

              <th className="p-4 text-left">
                Total
              </th>

              <th className="p-4 text-left">
                Fecha
              </th>

              <th className="p-4 text-left">
                Detalle
              </th>

              <th className="p-4 text-left">
                Editar
              </th>

              <th className="p-4 text-left">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredPurchases.map(
              (compra: any) => {

                const total =
                  compra.items.reduce(
                    (
                      acum: number,
                      item: any
                    ) =>
                      acum +
                      item.quantity *
                      item.costPrice,
                    0
                  );

                return (
                  <tr
                    key={compra.id}
                    className="border-t border-zinc-800"
                  >
                    <td className="p-4">
                      {compra.invoice}
                    </td>

                    <td className="p-4">
                      {compra.provider.name}
                    </td>

                    <td className="p-4">
                      {compra.items.length}
                    </td>

                    <td className="p-4 text-green-400 font-bold">
                      ${total}
                    </td>

                    <td className="p-4">
                      {new Date(
                        compra.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <a
                        href={`/compras/${compra.id}/detalle`}
                        className="bg-blue-600 px-3 py-2 rounded"
                      >
                        Ver
                      </a>
                    </td>

                    <td className="p-4">
                      <a
                        href={`/compras/${compra.id}`}
                        className="bg-yellow-600 px-3 py-2 rounded"
                      >
                        Editar
                      </a>
                    </td>

                    <td className="p-4">
                      <DeactivatePurchaseButton
                        purchaseId={compra.id}
                      />
                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}