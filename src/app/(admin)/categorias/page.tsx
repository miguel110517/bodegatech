import { prisma } from "@/lib/prisma";
import { createCategory } from "./actions/create-category";
import { deleteCategory } from "./actions/delete-category";

export default async function CategoriasPage() {
  const categorias = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          Categorías
        </h1>

        <p className="text-zinc-400 mb-8">
          Total categorías: {categorias.length}
        </p>

        <form
          action={createCategory}
          className="bg-zinc-900 p-6 rounded-xl mb-8"
        >
          <div className="mb-4">
            <input
              name="name"
              placeholder="Nombre categoría"
              className="w-full p-3 rounded bg-zinc-800"
              required
            />
          </div>

          <div className="mb-4">
            <textarea
              name="description"
              placeholder="Descripción"
              className="w-full p-3 rounded bg-zinc-800"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded"
          >
            Guardar Categoría
          </button>
        </form>

        <div className="space-y-4">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"
            >
              <h2 className="font-bold text-lg">
                {categoria.name}
              </h2>

              <p className="text-zinc-400 mt-2">
                {categoria.description || "Sin descripción"}
              </p>

              <div className="flex gap-3 mt-4">
                <a
                  href={`/categorias/${categoria.id}`}
                  className="bg-yellow-600 px-4 py-2 rounded"
                >
                  Editar
                </a>

                <form
                  action={async () => {
                    "use server";
                    await deleteCategory(categoria.id);
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
          ))}
        </div>
      </div>
    </main>
  );
}