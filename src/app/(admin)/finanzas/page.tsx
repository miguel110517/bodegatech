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

  const gastos = await prisma.expense.findMany();

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

  const totalVentas = ventas.reduce(
    (acum, item) =>
      acum +
      item.salePrice *
      item.quantity,
    0
  );

  const totalCompras = compras.reduce(
    (acum, item) =>
      acum +
      item.costPrice *
      item.quantity,
    0
  );

  const totalGastos = gastos.reduce(
    (acum, gasto) =>
      acum + gasto.amount,
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
    totalCompras;

  const gananciaNeta =
    totalVentas -
    totalCompras -
    totalGastos;

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

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Ventas Totales</p>
            <h2 className="text-3xl font-bold text-green-400">
              $
              {totalVentas.toLocaleString()}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Compras Totales</p>
            <h2 className="text-3xl font-bold text-yellow-400">
              $
              {totalCompras.toLocaleString()}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Gastos Totales</p>
            <h2 className="text-3xl font-bold text-red-400">
              $
              {totalGastos.toLocaleString()}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Cuentas por Cobrar</p>
            <h2 className="text-3xl font-bold text-orange-400">
              $
              {totalPorCobrar.toLocaleString()}
            </h2>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-zinc-900 p-6 rounded-xl">

            <h2 className="text-2xl font-bold mb-4">
              Ganancia Bruta
            </h2>

            <p className="text-4xl text-blue-400 font-bold">
              $
              {gananciaBruta.toLocaleString()}
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-xl">

            <h2 className="text-2xl font-bold mb-4">
              Ganancia Neta
            </h2>

            <p className="text-4xl text-green-400 font-bold">
              $
              {gananciaNeta.toLocaleString()}
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          <div>

            <h2 className="text-2xl font-bold mb-4">
              Productos Más Vendidos
            </h2>

            <div className="space-y-3">

              {topVendidos.map(
                (
                  producto,
                  index
                ) => (
                  <div
                    key={index}
                    className="bg-zinc-900 p-4 rounded-xl"
                  >
                    <div className="flex justify-between">

                      <span>
                        {producto.nombre}
                      </span>

                      <span className="text-green-400 font-bold">
                        {producto.vendidos}
                      </span>

                    </div>
                  </div>
                )
              )}

            </div>

          </div>

          <div>

            <h2 className="text-2xl font-bold mb-4">
              Productos Más Rentables
            </h2>

            <div className="space-y-3">

              {topRentables.map(
                (
                  producto,
                  index
                ) => (
                  <div
                    key={index}
                    className="bg-zinc-900 p-4 rounded-xl"
                  >
                    <div className="flex justify-between">

                      <span>
                        {producto.nombre}
                      </span>

                      <span className="text-blue-400 font-bold">
                        $
                        {producto.utilidad.toLocaleString()}
                      </span>

                    </div>
                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}