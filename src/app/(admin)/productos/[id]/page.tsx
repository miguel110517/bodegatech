import { prisma } from "@/lib/prisma";
import { updateProduct } from "../actions/update-product";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarProductoPage({
  params,
}: Props) {
  const { id } = await params;

  const producto = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!producto) {
    notFound();
  }

  const categorias = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Editar Producto
        </h1>

        <p className="text-zinc-400 mb-6">
          Editando: {producto.name}
        </p>

        <a
          href="/productos"
          className="inline-block mb-6 text-blue-400 hover:text-blue-300"
        >
          ← Volver a Productos
        </a>

        <form
          action={async (formData) => {
            "use server";
            await updateProduct(id, formData);
          }}
          className="bg-zinc-900 p-6 rounded-xl"
        >

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Nombre
              </label>

              <input
                name="name"
                defaultValue={producto.name}
                className="w-full p-3 rounded bg-zinc-800"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Marca
              </label>

              <input
                name="brand"
                defaultValue={producto.brand ?? ""}
                className="w-full p-3 rounded bg-zinc-800"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Precio costo
              </label>

              <input
                name="costPrice"
                type="number"
                step="0.01"
                defaultValue={producto.costPrice}
                className="w-full p-3 rounded bg-zinc-800"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Precio venta
              </label>

              <input
                name="salePrice"
                type="number"
                step="0.01"
                defaultValue={producto.salePrice}
                className="w-full p-3 rounded bg-zinc-800"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Precio oferta
              </label>

              <input
                name="offerPrice"
                type="number"
                step="0.01"
                defaultValue={producto.offerPrice ?? ""}
                className="w-full p-3 rounded bg-zinc-800"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Stock
              </label>

              <input
                name="stock"
                type="number"
                defaultValue={producto.stock}
                className="w-full p-3 rounded bg-zinc-800"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Stock mínimo
              </label>

              <input
                name="minStock"
                type="number"
                defaultValue={producto.minStock}
                className="w-full p-3 rounded bg-zinc-800"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Ubicación
              </label>

              <input
                name="location"
                defaultValue={producto.location ?? ""}
                className="w-full p-3 rounded bg-zinc-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm text-zinc-400">
                Categoría
              </label>

              <select
                name="categoryId"
                defaultValue={producto.categoryId}
                className="w-full p-3 rounded bg-zinc-800"
              >
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

          </div>

          <div className="mt-4">
            <label className="block mb-2 text-sm text-zinc-400">
              Descripción
            </label>

            <textarea
              name="description"
              defaultValue={producto.description ?? ""}
              className="w-full p-3 rounded bg-zinc-800"
              rows={5}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded mt-6"
          >
            Guardar Cambios
          </button>

        </form>

      </div>
    </main>
  );
}