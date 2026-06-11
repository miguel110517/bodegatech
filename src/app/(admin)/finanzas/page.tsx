export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function FinanzasPage() {

  const ventas = await prisma.saleItem.findMany({
    include: {
      product: true,
    },
  });

  const compras = await prisma.purchaseItem.findMany({
    include: {
      product: true,
    },
  });

  const gastos =
    await prisma.expense.findMany();

  const cuentas =
    await prisma.accountReceivable.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        sale: {
          include: {
            customer: true,
          },
        },
      },
    });

  const caja =
    await prisma.sale.aggregate({
      _sum: {
        cashAmount: true,
        transferAmount: true,
        cardAmount: true,
        creditAmount: true,
      },
    });

  const totalVentas = ventas.reduce(
    (acum, item) =>
      acum +
      item.salePrice *
      item.quantity,
    0
  );

  const costoVendido = ventas.reduce(
    (acum, item) =>
      acum +
      item.costPrice *
      item.quantity,
    0
  );

  const totalGastos =
    gastos.reduce(
      (acum, gasto) =>
        acum +
        gasto.amount,
      0
    );

  const totalPorCobrar =
    cuentas.reduce(
      (acum, cuenta) =>
        acum +
        cuenta.pendingAmount,
      0
    );

  const gananciaBruta =
    totalVentas -
    costoVendido;

  const gananciaNeta =
    gananciaBruta -
    totalGastos;

  const margen =
    totalVentas > 0
      ? (
          (gananciaBruta /
            totalVentas) *
          100
        ).toFixed(2)
      : "0";

  const productosMap =
    new Map<
      string,
      {
        nombre: string;
        vendidos: number;
        utilidad: number;
      }
    >();

  ventas.forEach((venta) => {

    const utilidad =
      (
        venta.salePrice -
        venta.costPrice
      ) *
      venta.quantity;

    const actual =
      productosMap.get(
        venta.productId
      );

    if (actual) {
      actual.vendidos +=
        venta.quantity;

      actual.utilidad +=
        utilidad;
    } else {
      productosMap.set(
        venta.productId,
        {
          nombre:
            venta.product.name,
          vendidos:
            venta.quantity,
          utilidad,
        }
      );
    }

  });

  const topVendidos =
    Array.from(
      productosMap.values()
    )
      .sort(
        (a, b) =>
          b.vendidos -
          a.vendidos
      )
      .slice(0, 5);

  const topRentables =
    Array.from(
      productosMap.values()
    )
      .sort(
        (a, b) =>
          b.utilidad -
          a.utilidad
      )
      .slice(0, 5);

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Finanzas
        </h1>

        {/* RESUMEN */}

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Ventas</p>
            <h2 className="text-3xl font-bold text-green-400">
              $
              {totalVentas.toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Costo Vendido</p>
            <h2 className="text-3xl font-bold text-yellow-400">
              $
              {costoVendido.toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Gastos</p>
            <h2 className="text-3xl font-bold text-red-400">
              $
              {totalGastos.toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Por Cobrar</p>
            <h2 className="text-3xl font-bold text-orange-400">
              $
              {totalPorCobrar.toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

        </div>

        {/* UTILIDAD */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-zinc-900 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">
              Ganancia Bruta
            </h2>

            <p className="text-4xl font-bold text-blue-400">
              $
              {gananciaBruta.toLocaleString(
                "es-CO"
              )}
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">
              Ganancia Neta
            </h2>

            <p className="text-4xl font-bold text-green-400">
              $
              {gananciaNeta.toLocaleString(
                "es-CO"
              )}
            </p>
          </div>

        </div>

        {/* FLUJO DE CAJA */}

        <div className="grid md:grid-cols-4 gap-4 mt-8">

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Efectivo</p>
            <h2 className="text-2xl font-bold text-green-400">
              $
              {(
                caja._sum.cashAmount ??
                0
              ).toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Transferencias</p>
            <h2 className="text-2xl font-bold text-cyan-400">
              $
              {(
                caja._sum
                  .transferAmount ??
                0
              ).toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Tarjetas</p>
            <h2 className="text-2xl font-bold text-yellow-400">
              $
              {(
                caja._sum.cardAmount ??
                0
              ).toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Crédito Generado</p>
            <h2 className="text-2xl font-bold text-orange-400">
              $
              {(
                caja._sum
                  .creditAmount ??
                0
              ).toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

        </div>

        {/* INDICADORES */}

        <div className="bg-zinc-900 p-6 rounded-xl mt-8">

          <div className="flex justify-between">

            <span>
              Margen de Utilidad
            </span>

            <span className="text-2xl font-bold text-green-400">
              {margen}%
            </span>

          </div>

        </div>

        {/* PRODUCTOS */}

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          <div>

            <h2 className="text-2xl font-bold mb-4">
              Más Vendidos
            </h2>

            <div className="space-y-3">

              {topVendidos.map(
                (
                  producto,
                  index
                ) => (
                  <div
                    key={index}
                    className="bg-zinc-900 p-4 rounded-xl flex justify-between"
                  >
                    <span>
                      {producto.nombre}
                    </span>

                    <span className="text-green-400 font-bold">
                      {
                        producto.vendidos
                      }
                    </span>
                  </div>
                )
              )}

            </div>

          </div>

          <div>

            <h2 className="text-2xl font-bold mb-4">
              Más Rentables
            </h2>

            <div className="space-y-3">

              {topRentables.map(
                (
                  producto,
                  index
                ) => (
                  <div
                    key={index}
                    className="bg-zinc-900 p-4 rounded-xl flex justify-between"
                  >
                    <span>
                      {producto.nombre}
                    </span>

                    <span className="text-blue-400 font-bold">
                      $
                      {producto.utilidad.toLocaleString(
                        "es-CO"
                      )}
                    </span>
                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* CUENTAS POR COBRAR */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-4">
            Créditos Pendientes
          </h2>

          <div className="space-y-3">

            {cuentas.map(
              (cuenta) => (
                <div
                  key={cuenta.id}
                  className="bg-zinc-900 p-4 rounded-xl"
                >

                  <div className="flex justify-between">

                    <div>
                      <p className="font-bold">
                        {
                          cuenta.sale
                            .customer
                            .name
                        }
                      </p>

                      <p className="text-zinc-400">
                        Factura:
                        {" "}
                        {
                          cuenta.sale
                            .invoice
                        }
                      </p>
                    </div>

                    <div className="text-right">

                      <p className="text-orange-400 font-bold">
                        $
                        {cuenta.pendingAmount.toLocaleString(
                          "es-CO"
                        )}
                      </p>

                      <p className="text-zinc-400">
                        {cuenta.dueDate
                          ? new Date(
                              cuenta.dueDate
                            ).toLocaleDateString(
                              "es-CO"
                            )
                          : "Sin fecha"}
                      </p>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </main>
  );
}