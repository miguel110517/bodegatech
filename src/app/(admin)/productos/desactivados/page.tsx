import { prisma } from "@/lib/prisma";
import { ReactivateProductButton } from "../components/reactivate-product-button";

export default async function ProductosDesactivadosPage() {
  const productos = await prisma.product.findMany({
    where: {
      active: false,
    },
    include: {
      category: true,
    },
    orderBy: {
      deletedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Productos Desactivados
            </h1>

            <p className="text-zinc-400 mt-2">
              Total: {productos.length}
            </p>
          </div>

          <a
            href="/productos"
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Volver a Productos
          </a>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">

          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-4">
                  Código
                </th>

                <th className="text-left p-4">
                  Producto
                </th>

                <th className="text-left p-4">
                  Marca
                </th>

                <th className="text-left p-4">
                  Fecha
                </th>

                <th className="text-left p-4">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr
                  key={producto.id}
                  className="border-b border-zinc-800"
                >
                  <td className="p-4">
                    {producto.code}
                  </td>

                  <td className="p-4">
                    {producto.name}
                  </td>

                  <td className="p-4">
                    {producto.brand || "-"}
                  </td>

                  <td className="p-4">
                    {producto.deletedAt?.toLocaleDateString() || "-"}
                  </td>

                  <td className="p-4">
                    <ReactivateProductButton
                      productId={producto.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}