import { prisma } from "@/lib/prisma";
import { UpdateProductToast } from "./components/update-product-toast";
import { CreateProductForm } from "./components/create-product-form";
import { ProductsTable } from "./components/products-table";

const ITEMS_PER_PAGE = 10;

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    updated?: string;
  }>;
}) {
  const params = await searchParams;

  const query = params.q || "";
  const page = Number(params.page || "1");

  const where = {
    active: true,

    OR: [
      {
        name: {
          contains: query,
          mode: "insensitive" as const,
        },
      },

      {
        code: {
          contains: query,
          mode: "insensitive" as const,
        },
      },

      {
        brand: {
          contains: query,
          mode: "insensitive" as const,
        },
      },
    ],
  };

  const totalProductos = await prisma.product.count({
    where,
  });

  const totalPages = Math.ceil(
    totalProductos / ITEMS_PER_PAGE
  );

  const productos = await prisma.product.findMany({
    where,

    include: {
      category: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  const categorias = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const productosDesactivados =
    await prisma.product.count({
      where: {
        active: false,
      },
    });

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">

        {params.updated === "1" && (
          <UpdateProductToast />
        )}

        <h1 className="text-4xl font-bold mb-2">
          Productos
        </h1>

        <div className="flex items-center justify-between mb-6">
          <p className="text-zinc-400">
            Total productos: {totalProductos}
          </p>

          <a
            href="/productos/desactivados"
            className="
              bg-orange-600
              hover:bg-orange-700
              px-4
              py-2
              rounded-xl
              font-medium
              transition
            "
          >
            Productos Desactivados ({productosDesactivados})
          </a>
        </div>

      

        <CreateProductForm
          categorias={categorias}
        />

        <div id="tabla-productos">
          <ProductsTable
            productos={productos}
          />
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">

            {page > 1 && (
              <a
                href={`/productos?q=${query}&page=${page - 1}#tabla-productos`}
                className="
          bg-zinc-800
          px-4
          py-2
          rounded-xl
        "
              >
                Anterior
              </a>
            )}

            <span
              className="
        bg-blue-600
        px-4
        py-2
        rounded-xl
      "
            >
              Página {page} de {totalPages}
            </span>

            {page < totalPages && (
              <a
                href={`/productos?q=${query}&page=${page + 1}#tabla-productos`}
                className="
          bg-zinc-800
          px-4
          py-2
          rounded-xl
        "
              >
                Siguiente
              </a>
            )}

          </div>
        )}

      </div>
    </main>
  );
}