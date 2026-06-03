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

        <h1 className="text-4xl font-bold mb-8">
          Editar Producto
        </h1>

        <form
          action={async (formData) => {
            "use server";
            await updateProduct(id, formData);
          }}
          className="bg-zinc-900 p-6 rounded-xl"
        >

          <div className="grid md:grid-cols-2 gap-4">

            <input
              name="name"
              defaultValue={producto.name}
              className="p-3 rounded bg-zinc-800"
              required
            />

            <input
              name="brand"
              defaultValue={producto.brand ?? ""}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="costPrice"
              type="number"
              step="0.01"
              defaultValue={producto.costPrice}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="salePrice"
              type="number"
              step="0.01"
              defaultValue={producto.salePrice}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="offerPrice"
              type="number"
              step="0.01"
              defaultValue={producto.offerPrice ?? ""}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="stock"
              type="number"
              defaultValue={producto.stock}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="minStock"
              type="number"
              defaultValue={producto.minStock}
              className="p-3 rounded bg-zinc-800"
            />

            <input
              name="location"
              defaultValue={producto.location ?? ""}
              className="p-3 rounded bg-zinc-800"
            />

            <select
              name="categoryId"
              defaultValue={producto.categoryId}
              className="p-3 rounded bg-zinc-800"
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

          <textarea
            name="description"
            defaultValue={producto.description ?? ""}
            className="w-full p-3 rounded bg-zinc-800 mt-4"
          />

          <button
            type="submit"
            className="bg-blue-600 px-5 py-3 rounded mt-4"
          >
            Guardar Cambios
          </button>

        </form>

      </div>
    </main>
  );
}