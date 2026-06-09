import { prisma } from "@/lib/prisma";

export default async function CuentasPorCobrarPage() {
  const cuentas = await prisma.accountReceivable.findMany({
    where: {
      active: true,
    },
    include: {
      sale: {
        include: {
          customer: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPendiente = cuentas.reduce(
    (acc, cuenta) => acc + cuenta.pendingAmount,
    0,
  );

  const totalPagado = cuentas.reduce(
    (acc, cuenta) => acc + cuenta.paidAmount,
    0,
  );

  const cuentasPendientes = cuentas.filter(
    (cuenta) => cuenta.status === "PENDING",
  ).length;

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Cuentas por Cobrar
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 p-5 rounded-xl">
            <p className="text-zinc-400">
              Cuentas Pendientes
            </p>

            <h2 className="text-3xl font-bold">
              {cuentasPendientes}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p className="text-zinc-400">
              Total Pendiente
            </p>

            <h2 className="text-3xl font-bold text-red-400">
              ${totalPendiente.toLocaleString("es-CO")}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p className="text-zinc-400">
              Total Recuperado
            </p>

            <h2 className="text-3xl font-bold text-green-400">
              ${totalPagado.toLocaleString("es-CO")}
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-zinc-900 rounded-xl overflow-hidden">
            <thead className="bg-zinc-800">
              <tr>
                <th className="p-4 text-left">
                  Factura
                </th>

                <th className="p-4 text-left">
                  Cliente
                </th>

                <th className="p-4 text-right">
                  Total
                </th>

                <th className="p-4 text-right">
                  Pagado
                </th>

                <th className="p-4 text-right">
                  Pendiente
                </th>

                <th className="p-4 text-center">
                  Fecha límite
                </th>

                <th className="p-4 text-center">
                  Estado
                </th>

                <th className="p-4 text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {cuentas.map((cuenta) => {
                const vencida =
                  cuenta.status === "PENDING" &&
                  cuenta.dueDate &&
                  new Date(cuenta.dueDate) <
                    new Date();

                return (
                  <tr
                    key={cuenta.id}
                    className="border-t border-zinc-800"
                  >
                    <td className="p-4">
                      {cuenta.sale.invoice}
                    </td>

                    <td className="p-4">
                      {cuenta.sale.customer.name}
                    </td>

                    <td className="p-4 text-right">
                      $
                      {cuenta.totalAmount.toLocaleString(
                        "es-CO",
                      )}
                    </td>

                    <td className="p-4 text-right text-green-400 font-bold">
                      $
                      {cuenta.paidAmount.toLocaleString(
                        "es-CO",
                      )}
                    </td>

                    <td className="p-4 text-right text-red-400 font-bold">
                      $
                      {cuenta.pendingAmount.toLocaleString(
                        "es-CO",
                      )}
                    </td>

                    <td className="p-4 text-center">
                      {cuenta.dueDate
                        ? new Date(
                            cuenta.dueDate,
                          ).toLocaleDateString(
                            "es-CO",
                          )
                        : "-"}
                    </td>

                    <td className="p-4 text-center">
                      {vencida ? (
                        <span className="text-red-500 font-bold">
                          VENCIDA
                        </span>
                      ) : cuenta.status ===
                        "PAID" ? (
                        <span className="text-green-400 font-bold">
                          PAGADA
                        </span>
                      ) : (
                        <span className="text-yellow-400 font-bold">
                          PENDIENTE
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <a
                          href={`/cuentas-por-cobrar/${cuenta.id}`}
                          className="bg-blue-600 px-4 py-2 rounded"
                        >
                          Gestionar
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}