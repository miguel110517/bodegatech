
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
<section className="bg-gradient-to-r from-blue-900 to-black py-10">

  <div className="max-w-7xl mx-auto px-6">

    <h1 className="text-5xl font-bold">
      Catálogo Bodega Tech
    </h1>

    <p className="text-zinc-300 mt-4">
      Tecnología, accesorios y gadgets para todo Colombia.
    </p>

    <div className="flex gap-4 mt-6">

      <a
        href="#catalogo"
        className="bg-blue-600 px-6 py-3 rounded-xl font-semibold"
      >
        Ver Productos
      </a>

      <a
        href="https://wa.me/573013978997"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 px-6 py-3 rounded-xl font-semibold"
      >
        WhatsApp
      </a>

    </div>

    <div className="mt-8">

      <input
        type="text"
        placeholder="Buscar producto..."
        className="w-full md:w-96 p-4 rounded-xl bg-zinc-900 border border-zinc-700"
      />

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

{/* BANNER CONFIANZA */}
<section className="max-w-7xl mx-auto px-6 py-8">

  <div className="grid md:grid-cols-3 gap-4">

    <div className="bg-zinc-900 p-4 rounded-xl text-center">
      ✓ Garantía de calidad
    </div>

    <div className="bg-zinc-900 p-4 rounded-xl text-center">
      ✓ Atención personalizada
    </div>

    <div className="bg-zinc-900 p-4 rounded-xl text-center">
      ✓ Envíos nacionales
    </div>

  </div>

</section>

{/* TODOS LOS PRODUCTOS */}
<section
  id="catalogo"
  className="max-w-7xl mx-auto px-6 py-12"
>

  <h2 className="text-3xl font-bold mb-8">
    Todos los Productos
  </h2>

  <p className="text-zinc-400 mb-8">
    Mostrando {productos.length} productos disponibles
  </p>

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
              className="mt-4 bg-blue-600 text-center py-3 rounded-xl font-semibold"
            >
              Ver Producto
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

        <div className="max-w-7xl mx-auto px-6 py-10">

          <h3 className="text-2xl font-bold">
            Bodega Tech
          </h3>

          <p className="text-zinc-400 mt-3">
            Tecnología, accesorios y soluciones para Colombia.
          </p>

          <div className="mt-6">

            <a
              href="https://wa.me/573013978997"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400"
            >
              WhatsApp
            </a>

          </div>

          <p className="text-zinc-500 mt-8 text-sm">
            © 2026 Bodega Tech. Todos los derechos reservados.
          </p>

          <p className="text-zinc-600 text-sm mt-2">
            Desarrollado por Miguel Macea
          </p>

        </div>

      </footer>

    </main>
  );
}

