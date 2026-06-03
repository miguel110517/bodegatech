import { prisma } from "@/lib/prisma";

export default async function ProductosWebPage() {
  const productos = await prisma.product.findMany({
    where: {
      active: true,
    },
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

  const destacados = productos.slice(0, 4);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <section className="bg-gradient-to-r from-blue-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold">
            Catálogo Bodega Tech
          </h1>
          <p className="text-zinc-300 mt-4">
            Tecnología, accesorios y gadgets para todo Colombia.
          </p>
          <div className="mt-8">
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full md:w-96 p-4 rounded-xl bg-zinc-900 border border-zinc-700"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-6">
          Categorías
        </h2>
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-600 px-4 py-2 rounded-xl">
            Todos
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl"
            >
              {categoria.name}
            </button>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">
          Productos Destacados
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {destacados.map((producto) => (
            <div
              key={producto.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800"
            >
              <div className="h-48 w-full overflow-hidden bg-zinc-800">
                {producto.imageUrl ? (
                  <img
                    src={producto.imageUrl}
                    alt={producto.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg">
                  {producto.name}
                </h3>
                <p className="text-zinc-400 text-sm">
                  {producto.category.name}
                </p>
                <p className="text-blue-400 font-bold text-2xl mt-3">
                  ${(producto.offerPrice ?? producto.salePrice).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TODOS LOS PRODUCTOS */}

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">
          Todos los Productos
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          ```
          {productos.map((producto) => (

            <div
              key={producto.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-blue-500 transition flex flex-col h-full"
            >

              <div className="h-48 w-full overflow-hidden bg-zinc-800">

                {producto.imageUrl ? (
                  <img
                    src={producto.imageUrl}
                    alt={producto.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    Sin imagen
                  </div>
                )}

              </div>

              <div className="p-5 flex flex-col flex-1">

                <span className="bg-blue-700 px-2 py-1 rounded text-xs w-fit">
                  {producto.category.name}
                </span>

                <h3 className="font-bold text-xl mt-3">
                  {producto.name}
                </h3>

                <p className="text-zinc-500 text-sm">
                  Código: {producto.code}
                </p>

                <p className="text-zinc-400 mt-3 flex-1">
                  {producto.description || "Sin descripción"}
                </p>

                <div className="mt-4">

                  {producto.offerPrice ? (
                    <>
                      <p className="line-through text-zinc-500">
                        ${producto.salePrice.toLocaleString()}
                      </p>

                      <p className="text-green-400 text-2xl font-bold">
                        ${producto.offerPrice.toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-blue-400 text-2xl font-bold">
                      ${producto.salePrice.toLocaleString()}
                    </p>
                  )}

                </div>

                <a
                  href={`https://wa.me/573013978997?text=${encodeURIComponent(
                    `Hola, me interesa el producto ${producto.name}`
                  )}`}
                  target="_blank"
                  className="mt-4 bg-green-600 text-center py-3 rounded-xl font-semibold"
                >
                  Consultar por WhatsApp
                </a>

              </div>

            </div>

          ))}
          ```

        </div>
      </section>
          {/* CONTACTO */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-zinc-900 rounded-3xl p-10 text-center">

          <h2 className="text-4xl font-bold">
            ¿Necesitas ayuda?
          </h2>

          <p className="text-zinc-400 mt-4">
            Escríbenos y recibe atención personalizada.
          </p>

          <a
            href="https://wa.me/573013978997"
            target="_blank"
            className="inline-block mt-6 bg-blue-600 px-8 py-4 rounded-xl"
          >
            WhatsApp
          </a>

        </div>
      </section>

    </main>
  );
}
