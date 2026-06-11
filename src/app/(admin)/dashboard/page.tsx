
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const clientes = await prisma.customer.count();

  const proveedores = await prisma.provider.count();

  const productos = await prisma.product.count();

  const stockBajo = await prisma.product.count({
    where: {
      stock: {
        lte: 5,
      },
    },
  });

  const resumenCaja =
    await prisma.sale.aggregate({
      _sum: {
        cashAmount: true,
        transferAmount: true,
        cardAmount: true,
        creditAmount: true,
      },
    });

  const cuentasPendientes =
    await prisma.accountReceivable.aggregate({
      where: {
        status: "PENDING",
      },
      _sum: {
        pendingAmount: true,
      },
      _count: true,
    });

  const productosStockBajo =
    await prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
      },
      orderBy: {
        stock: "asc",
      },
      take: 10,
    });

  const ventas =
    await prisma.saleItem.findMany({
      include: {
        product: true,
      },
    });

  const ventasAgrupadas = new Map<
    string,
    {
      nombre: string;
      cantidad: number;
    }
  >();

  ventas.forEach((venta) => {
    const actual =
      ventasAgrupadas.get(
        venta.productId
      );

    if (actual) {
      actual.cantidad +=
        venta.quantity;
    } else {
      ventasAgrupadas.set(
        venta.productId,
        {
          nombre:
            venta.product.name,
          cantidad:
            venta.quantity,
        }
      );
    }
  });

  const topVendidos =
    Array.from(
      ventasAgrupadas.values()
    )
      .sort(
        (a, b) =>
          b.cantidad -
          a.cantidad
      )
      .slice(0, 10);

  const ultimasVentas =
    await prisma.sale.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

  const ultimasCompras =
    await prisma.purchase.findMany({
      include: {
        provider: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">

          <a
            href="/productos"
            className="bg-zinc-900 p-5 rounded-xl text-center hover:bg-zinc-800"
          >
            <div className="text-3xl">
              📦
            </div>

            <p className="mt-2">
              Productos
            </p>
          </a>

          <a
            href="/clientes"
            className="bg-zinc-900 p-5 rounded-xl text-center hover:bg-zinc-800"
          >
            <div className="text-3xl">
              👥
            </div>

            <p className="mt-2">
              Clientes
            </p>
          </a>

          <a
            href="/proveedores"
            className="bg-zinc-900 p-5 rounded-xl text-center hover:bg-zinc-800"
          >
            <div className="text-3xl">
              🚚
            </div>

            <p className="mt-2">
              Proveedores
            </p>
          </a>

          <a
            href="/compras"
            className="bg-zinc-900 p-5 rounded-xl text-center hover:bg-zinc-800"
          >
            <div className="text-3xl">
              🛒
            </div>

            <p className="mt-2">
              Compras
            </p>
          </a>

          <a
            href="/ventas"
            className="bg-zinc-900 p-5 rounded-xl text-center hover:bg-zinc-800"
          >
            <div className="text-3xl">
              💰
            </div>

            <p className="mt-2">
              Ventas
            </p>
          </a>

          <a
            href="/finanzas"
            className="bg-zinc-900 p-5 rounded-xl text-center hover:bg-zinc-800"
          >
            <div className="text-3xl">
              📊
            </div>

            <p className="mt-2">
              Finanzas
            </p>
          </a>

        </div>

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Clientes</p>

            <h2 className="text-3xl font-bold">
              {clientes}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Proveedores</p>

            <h2 className="text-3xl font-bold">
              {proveedores}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Productos</p>

            <h2 className="text-3xl font-bold">
              {productos}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Stock Bajo</p>

            <h2 className="text-3xl font-bold text-red-400">
              {stockBajo}
            </h2>
          </div>

        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-8">

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Efectivo</p>

            <h2 className="text-3xl font-bold text-green-400">
              $
              {(
                resumenCaja._sum
                  .cashAmount ?? 0
              ).toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Transferencias</p>

            <h2 className="text-3xl font-bold text-cyan-400">
              $
              {(
                resumenCaja._sum
                  .transferAmount ?? 0
              ).toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Tarjetas</p>

            <h2 className="text-3xl font-bold text-yellow-400">
              $
              {(
                resumenCaja._sum
                  .cardAmount ?? 0
              ).toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Crédito Pendiente</p>

            <h2 className="text-3xl font-bold text-orange-400">
              $
              {(
                cuentasPendientes
                  ._sum
                  .pendingAmount ??
                0
              ).toLocaleString(
                "es-CO"
              )}
            </h2>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="bg-zinc-900 p-6 rounded-xl">

            <h2 className="text-2xl font-bold mb-4">
              Cuentas por Cobrar
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>
                  Facturas Pendientes
                </span>

                <span className="font-bold">
                  {
                    cuentasPendientes
                      ._count
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Total Pendiente
                </span>

                <span className="font-bold text-orange-400">
                  $
                  {(
                    cuentasPendientes
                      ._sum
                      .pendingAmount ??
                    0
                  ).toLocaleString(
                    "es-CO"
                  )}
                </span>
              </div>

            </div>

          </div>

          <div className="bg-zinc-900 p-6 rounded-xl">

            <h2 className="text-2xl font-bold mb-4">
              Resumen Rápido
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>
                  Última Venta
                </span>

                <span>
                  {
                    ultimasVentas[0]
                      ?.invoice ||
                    "-"
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Última Compra
                </span>

                <span>
                  {
                    ultimasCompras[0]
                      ?.invoice ||
                    "-"
                  }
                </span>
              </div>

            </div>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div>

            <h2 className="text-2xl font-bold mb-4">
              Productos con Stock Bajo
            </h2>

            <div className="space-y-2">

              {productosStockBajo.map(
                (
                  producto
                ) => (
                  <div
                    key={
                      producto.id
                    }
                    className="bg-zinc-900 p-4 rounded-xl"
                  >
                    <div className="flex justify-between">

                      <span>
                        {
                          producto.name
                        }
                      </span>

                      <span className="text-red-400 font-bold">
                        {
                          producto.stock
                        }
                      </span>

                    </div>
                  </div>
                )
              )}

            </div>

          </div>

          <div>

            <h2 className="text-2xl font-bold mb-4">
              Top Productos Vendidos
            </h2>

            <div className="space-y-2">

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
                        {
                          producto.nombre
                        }
                      </span>

                      <span className="text-green-400 font-bold">
                        {
                          producto.cantidad
                        }
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

