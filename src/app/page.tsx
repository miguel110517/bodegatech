
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  Headphones,
  ArrowRight,
} from "lucide-react";

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

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-950 via-black to-black py-24 border-b border-zinc-800">

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-3xl">

            <h1 className="text-6xl font-extrabold leading-tight">
              Tecnología de calidad para toda Colombia
            </h1>

            <p className="text-zinc-400 text-xl mt-6">
              Computadores, accesorios, periféricos,
              componentes y tecnología al mejor precio.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <a
                href="#productos"
                className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-semibold flex items-center gap-2"
              >
                Ver productos
                <ArrowRight size={18} />
              </a>

              <a
                href="https://wa.me/573013978997"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-zinc-700 px-8 py-4 rounded-xl"
              >
                Contactar
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* BENEFICIOS */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

            <Truck size={32} />

            <h3 className="font-bold mt-4">
              Envíos nacionales
            </h3>

            <p className="text-zinc-400 mt-2">
              Cobertura a toda Colombia.
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

            <ShieldCheck size={32} />

            <h3 className="font-bold mt-4">
              Compra segura
            </h3>

            <p className="text-zinc-400 mt-2">
              Productos garantizados.
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

            <ShoppingCart size={32} />

            <h3 className="font-bold mt-4">
              Precios competitivos
            </h3>

            <p className="text-zinc-400 mt-2">
              Las mejores ofertas.
            </p>

          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">

            <Headphones size={32} />

            <h3 className="font-bold mt-4">
              Soporte personalizado
            </h3>

            <p className="text-zinc-400 mt-2">
              Atención rápida y eficiente.
            </p>

          </div>

        </div>

      </section>

      {/* CATEGORÍAS */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="text-3xl font-bold mb-6">
          Categorías
        </h2>

        <div className="flex flex-wrap gap-3">

          <button className="bg-blue-600 px-4 py-2 rounded-xl font-medium">
            Todos
          </button>

          {categorias.map((categoria) => (

            <button
              key={categoria.id}
              className="bg-zinc-900 border border-zinc-700 hover:border-blue-500 transition px-4 py-2 rounded-xl"
            >
              {categoria.name}
            </button>

          ))}

        </div>

      </section>

      {/* DESTACADOS */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-bold">
            Productos Destacados
          </h2>

        </div>

        <div className="grid md:grid-cols-4 gap-6">

          {destacados.map((producto) => (

            <div
              key={producto.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-blue-500 transition"
            >

              <div className="h-52 w-full overflow-hidden bg-zinc-800">

                {producto.imageUrl ? (

                  <img
                    src={producto.imageUrl}
                    alt={producto.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    Sin imagen
                  </div>

                )}

              </div>

              <div className="p-5">

                <p className="text-zinc-500 text-sm">
                  {producto.category.name}
                </p>

                <h3 className="font-bold text-lg mt-2">
                  {producto.name}
                </h3>

                <p className="text-blue-400 font-bold text-2xl mt-4">
                  $
                  {(producto.offerPrice ?? producto.salePrice).toLocaleString()}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* TODOS LOS PRODUCTOS */}
      <section
        id="productos"
        className="max-w-7xl mx-auto px-6 py-12"
      >

        <h2 className="text-3xl font-bold mb-8">
          Todos los Productos
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {productos.map((producto) => (

            <div
              key={producto.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-blue-500 transition flex flex-col h-full"
            >

              <div className="h-52 w-full overflow-hidden bg-zinc-800">

                {producto.imageUrl ? (

                  <img
                    src={producto.imageUrl}
                    alt={producto.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
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

                <p className="text-zinc-500 text-sm mt-1">
                  Código: {producto.code}
                </p>

                <p className="text-zinc-400 mt-3 flex-1">
                  {producto.description || "Sin descripción"}
                </p>

                <div className="mt-5">

                  {producto.offerPrice ? (
                    <>
                      <p className="line-through text-zinc-500">
                        ${producto.salePrice.toLocaleString()}
                      </p>

                      <p className="text-green-400 text-3xl font-bold">
                        ${producto.offerPrice.toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-blue-400 text-3xl font-bold">
                      ${producto.salePrice.toLocaleString()}
                    </p>
                  )}

                </div>

                <div className="mt-5 flex flex-col gap-3">

                  <a
                    href={`/producto/${producto.id}`}
                    className="bg-blue-600 hover:bg-blue-700 transition text-center py-3 rounded-xl font-semibold"
                  >
                    Ver producto
                  </a>

                  <a
                    href={`https://wa.me/573013978997?text=${encodeURIComponent(
                      `Hola, me interesa el producto ${producto.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 transition text-center py-3 rounded-xl font-semibold"
                  >
                    Comprar Ahora
                  </a>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* CONTACTO */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">

          <h2 className="text-4xl font-bold">
            ¿Necesitas ayuda?
          </h2>

          <p className="text-zinc-400 mt-4">
            Escríbenos y recibe atención personalizada.
          </p>

          <a
            href="https://wa.me/573013978997"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-semibold"
          >
            WhatsApp
          </a>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 mt-20">

        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="grid md:grid-cols-3 gap-10">

            <div>

              <h3 className="font-bold text-2xl">
                Bodega Tech
              </h3>

              <p className="text-zinc-400 mt-4">
                Tecnología, accesorios y soluciones digitales.
              </p>

            </div>

            <div>

              <h3 className="font-bold">
                Contacto
              </h3>

              <p className="text-zinc-400 mt-4">
                WhatsApp: +57 301 397 8997
              </p>

            </div>

            <div>

              <h3 className="font-bold">
                Horario
              </h3>

              <p className="text-zinc-400 mt-4">
                Lunes a Sábado
              </p>

            </div>

          </div>

          <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-zinc-500">
            © {new Date().getFullYear()} Bodega Tech - Desarrollado por Miguel Macea
          </div>

        </div>

      </footer>

    </main>
  );
}

