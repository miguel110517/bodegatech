import { prisma } from "@/lib/prisma";
import { createProduct } from "./actions/create-product";
import { deleteProduct } from "./actions/delete-product";

export default async function ProductosPage() {
  const productos = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categorias = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Productos
        </h1>

        <p className="text-zinc-400 mb-8">
          Total productos: {productos.length}
        </p>

        <form
          action={createProduct}
          className="bg-zinc-900 p-6 rounded-xl mb-10"
        >
          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="name"
              placeholder="Nombre"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="brand"
              placeholder="Marca"
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="imageUrl"
              placeholder="URL de la imagen"
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="costPrice"
              type="number"
              step="0.01"
              placeholder="Precio costo"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="salePrice"
              type="number"
              step="0.01"
              placeholder="Precio venta"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="offerPrice"
              type="number"
              step="0.01"
              placeholder="Precio oferta"
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="minStock"
              type="number"
              placeholder="Stock mínimo"
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="location"
              placeholder="Ubicación"
              className="p-3 rounded bg-zinc-800"
            />

            <select
              name="categoryId"
              className="p-3 rounded bg-zinc-800"
              required
            >
              <option value="">
                Seleccione categoría
              </option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.name}
                </option>
              ))}
            </select>

          </div>

          <textarea
            name="description"
            placeholder="Descripción"
            className="w-full p-3 rounded bg-zinc-800 mt-4"
          />

          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded mt-4"
          >
            Guardar Producto
          </button>

        </form>

        <div className="grid gap-4">

          {productos.map((producto) => {

            const utilidad =
              (producto.offerPrice ?? producto.salePrice) -
              producto.costPrice;

            return (
              <div
                key={producto.id}
                className="bg-zinc-900 p-5 rounded-xl border border-zinc-800"
              >

                <div className="flex justify-between">

                  <div className="flex gap-4 items-center">

                    {producto.imageUrl && (
                      <img
                        src={producto.imageUrl}
                        alt={producto.name}
                        className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                      />
                    )}

                    <div>

                      <h2 className="text-xl font-bold">
                        {producto.name}
                      </h2>

                      <p className="text-zinc-400">
                        {producto.code}
                      </p>

                    </div>

                  </div>
                  <div>
                    <span className="bg-blue-700 px-3 py-1 rounded">
                      {producto.category.name}
                    </span>
                  </div>

                </div>

                <div className="mt-4 space-y-1">

                  <p>
                    Marca: {producto.brand || "-"}
                  </p>

                  <p>
                    Stock: {producto.stock}
                  </p>

                  <p>
                    Stock mínimo: {producto.minStock}
                  </p>

                  <p>
                    Ubicación: {producto.location || "-"}
                  </p>

                  <p>
                    Costo: ${producto.costPrice}
                  </p>

                  <p>
                    Venta: ${producto.salePrice}
                  </p>

                  <p>
                    Oferta: ${producto.offerPrice ?? "-"}
                  </p>

                  <p className="text-green-400">
                    Utilidad: ${utilidad}
                  </p>

                </div>

                <div className="flex gap-3 mt-4">

                  <a
                    href={`/productos/${producto.id}`}
                    className="bg-yellow-600 px-4 py-2 rounded"
                  >
                    Editar
                  </a>

                  <a
                    href={`/productos/${producto.id}/historial`}
                    className="bg-blue-600 px-4 py-2 rounded"
                  >
                    Hitorial
                  </a>

                  <form
                    action={async () => {
                      "use server";
                      await deleteProduct(producto.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-red-600 px-4 py-2 rounded"
                    >
                      Eliminar
                    </button>
                  </form>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </main>
  );
}