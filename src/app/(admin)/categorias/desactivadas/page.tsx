import { prisma } from "@/lib/prisma";
import { restoreCategory } from "../actions/restore-category";

export default async function CategoriasDesactivadasPage() {
  const categorias = await prisma.category.findMany({
    where: {
      active: false,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      deletedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Categorías Desactivadas
          </h1>

          <a
            href="/categorias"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            ← Volver
          </a>
        </div>

        {categorias.length === 0 ? (
          <div className="bg-zinc-900 p-8 rounded-xl text-center text-zinc-400">
            No hay categorías desactivadas.
          </div>
        ) : (
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

                <p className="text-blue-400 mt-2">
                  Productos: {categoria._count.products}
                </p>

                <p className="text-zinc-500 text-sm mt-2">
                  Desactivada:
                  {" "}
                  {categoria.deletedAt
                    ? new Date(
                        categoria.deletedAt
                      ).toLocaleDateString("es-CO")
                    : "-"}
                </p>

                <div className="mt-4">
                  <form
                    action={async () => {
                      "use server";
                      await restoreCategory(categoria.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                    >
                      Restaurar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}