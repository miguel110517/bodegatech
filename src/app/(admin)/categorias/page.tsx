import { prisma } from "@/lib/prisma";
import { createCategory } from "./actions/create-category";
import { deleteCategory } from "./actions/delete-category";
import { CreateCategoryForm } from "./components/create-category-form";
import { DeactivateCategoryButton } from "./components/deactivate-category-button";
export default async function CategoriasPage() {
  const categorias = await prisma.category.findMany({
    where: {
      active: true,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Categorías</h1>

            <p className="text-zinc-400 mt-2">
              Total categorías: {categorias.length}
            </p>
          </div>

          <a
            href="/categorias/desactivadas"
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Categorías Desactivadas
          </a>
        </div>

        <CreateCategoryForm />

        <div className="overflow-x-auto">
          <table className="w-full bg-zinc-900 rounded-xl overflow-hidden">
            <thead className="bg-zinc-800">
              <tr>
                <th className="p-4 text-left">Nombre</th>

                <th className="p-4 text-left">Descripción</th>

                <th className="p-4 text-center">Productos</th>

                <th className="p-4 text-center">Fecha</th>

                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-t border-zinc-800">
                  <td className="p-4 font-bold">{categoria.name}</td>

                  <td className="p-4 text-zinc-400">
                    {categoria.description || "Sin descripción"}
                  </td>

                  <td className="p-4 text-center text-blue-400 font-bold">
                    {categoria._count.products}
                  </td>

                  <td className="p-4 text-center">
                    {new Date(categoria.createdAt).toLocaleDateString("es-CO")}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <a
                        href={`/categorias/${categoria.id}`}
                        className="bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded"
                      >
                        Editar
                      </a>
                      <DeactivateCategoryButton categoryId={categoria.id} />
                    </div>
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
