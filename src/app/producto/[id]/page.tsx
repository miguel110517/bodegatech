import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const producto = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });

  if (!producto) {
    notFound();
  }

  const relacionados = await prisma.product.findMany({
    where: {
      categoryId: producto.categoryId,
      id: {
        not: producto.id,
      },
      active: true,
    },
    take: 4,
  });

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-6 py-10">

        <a
          href="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft size={18} />
          Volver al catálogo
        </a>

        <div className="grid lg:grid-cols-2 gap-12 mt-10">

          {/* IMAGEN */}

          <div>

            <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800">

              {producto.imageUrl ? (
                <img
                  src={producto.imageUrl}
                  alt={producto.name}
                  className="w-full h-[550px] object-cover"
                />
              ) : (
                <div className="h-[550px] flex items-center justify-center text-zinc-500">
                  Sin imagen disponible
                </div>
              )}

            </div>

          </div>

          {/* INFORMACIÓN */}

          <div>

            <span className="bg-blue-600 px-4 py-2 rounded-full text-sm">
              {producto.category.name}
            </span>

            <h1 className="text-5xl font-bold mt-5">
              {producto.name}
            </h1>

            <p className="text-zinc-500 mt-3">
              Código: {producto.code}
            </p>

            <div className="mt-8">

              {producto.offerPrice ? (
                <>
                  <p className="text-zinc-500 line-through text-2xl">
                    ${producto.salePrice.toLocaleString()}
                  </p>

                  <p className="text-green-400 text-6xl font-bold">
                    ${producto.offerPrice.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-blue-400 text-6xl font-bold">
                  ${producto.salePrice.toLocaleString()}
                </p>
              )}

            </div>

            <p className="text-zinc-300 mt-8 text-lg leading-relaxed">
              {producto.description || "Producto disponible en nuestro catálogo."}
            </p>

            <div className="grid grid-cols-1 gap-4 mt-10">

              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <Truck size={22} />
                <span>Envíos a toda Colombia</span>
              </div>

              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <ShieldCheck size={22} />
                <span>Compra segura</span>
              </div>

              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <BadgeCheck size={22} />
                <span>Productos garantizados</span>
              </div>

            </div>

            <a
              href={`https://wa.me/573013978997?text=${encodeURIComponent(
                `Hola, me interesa el producto ${producto.name}`
              )}`}
              target="_blank"
              className="mt-10 w-full bg-green-600 hover:bg-green-700 transition rounded-2xl py-5 flex items-center justify-center gap-3 text-xl font-bold"
            >
              <MessageCircle size={24} />
              Consultar por WhatsApp
            </a>

          </div>

        </div>

        {/* RELACIONADOS */}

        {relacionados.length > 0 && (
          <section className="mt-24">

            <h2 className="text-4xl font-bold mb-10">
              Productos Relacionados
            </h2>

            <div className="grid md:grid-cols-4 gap-6">

              {relacionados.map((item) => (
                <a
                  key={item.id}
                  href={`/producto/${item.id}`}
                  className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-blue-500 transition"
                >

                  <div className="h-56 bg-zinc-800">

                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
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
                      {item.name}
                    </h3>

                    <p className="text-zinc-500 text-sm mt-1">
                      {producto.category.name}
                    </p>

                    <p className="text-blue-400 font-bold text-2xl mt-4">
                      $
                      {(item.offerPrice ?? item.salePrice).toLocaleString()}
                    </p>

                  </div>

                </a>
              ))}

            </div>

          </section>
        )}

      </div>

    </main>
  );
}