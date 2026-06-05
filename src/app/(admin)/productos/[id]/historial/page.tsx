import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}



export default async function HistorialProductoPage({
  params,
}: Props) {
  const { id } = await params;

  const producto = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,

      purchaseItems: {
        include: {
          purchase: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      saleItems: {
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
      },
    },
  });

  if (!producto) {
    notFound();
  }

  const totalComprado =
    producto.purchaseItems.reduce(
      (acum, item) =>
        acum + item.quantity,
      0
    );

  const totalVendido =
    producto.saleItems.reduce(
      (acum, item) =>
        acum + item.quantity,
      0
    );

  const utilidad =
    producto.saleItems.reduce(
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
  <div className="max-w-7xl mx-auto">

    <a
      href="/productos"
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
      ← Volver a Productos
    </a>

    <h1 className="text-4xl font-bold mb-8">
      Historial del Producto
    </h1>

        <div className="bg-zinc-900 p-6 rounded-xl mb-8">

          <h2 className="text-2xl font-bold mb-4">
            {producto.name}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <p>
              <strong>Código:</strong>{" "}
              {producto.code}
            </p>

            <p>
              <strong>Marca:</strong>{" "}
              {producto.brand || "-"}
            </p>

            <p>
              <strong>Categoría:</strong>{" "}
              {producto.category.name}
            </p>

            <p>
              <strong>Stock:</strong>{" "}
              {producto.stock}
            </p>

            <p>
              <strong>Precio Costo:</strong>{" "}
              $
              {producto.costPrice.toLocaleString()}
            </p>

            <p>
              <strong>Precio Venta:</strong>{" "}
              $
              {producto.salePrice.toLocaleString()}
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Total Comprado</p>

            <h2 className="text-3xl font-bold text-yellow-400">
              {totalComprado}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Total Vendido</p>

            <h2 className="text-3xl font-bold text-green-400">
              {totalVendido}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-xl">
            <p>Utilidad Generada</p>

            <h2 className="text-3xl font-bold text-blue-400">
              $
              {utilidad.toLocaleString()}
            </h2>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-8">

          <div>

            <h2 className="text-2xl font-bold mb-4">
              Historial de Compras
            </h2>

            <div className="space-y-3">

              {producto.purchaseItems.map(
                (item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 p-4 rounded-xl"
                  >
                    <p>
                      Factura:{" "}
                      {item.purchase.invoice ||
                        "-"}
                    </p>

                    <p>
                      Cantidad:{" "}
                      {item.quantity}
                    </p>

                    <p>
                      Costo: $
                      {item.costPrice.toLocaleString()}
                    </p>

                    <p className="text-zinc-400 text-sm">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )
              )}

            </div>

          </div>

          <div>

            <h2 className="text-2xl font-bold mb-4">
              Historial de Ventas
            </h2>

            <div className="space-y-3">

              {producto.saleItems.map(
                (item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900 p-4 rounded-xl"
                  >
                    <p>
                      Factura:{" "}
                      {item.sale.invoice ||
                        "-"}
                    </p>

                    <p>
                      Cliente:{" "}
                      {
                        item.sale.customer
                          .name
                      }
                    </p>

                    <p>
                      Cantidad:{" "}
                      {item.quantity}
                    </p>

                    <p>
                      Venta: $
                      {item.salePrice.toLocaleString()}
                    </p>

                    <p className="text-zinc-400 text-sm">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </p>
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