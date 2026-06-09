import { prisma } from "@/lib/prisma";
import { ActivatePurchaseButton } from "../components/activate-purchase-button";

export default async function ComprasDesactivadasPage() {
    const compras = await prisma.purchase.findMany({
        where: {
            active: false,
        },

        include: {
            provider: true,
            items: {
                include: {
                    product: true,
                },
            },
        },

        orderBy: {
            deletedAt: "desc",
        },
    });

    return (
        <main className="min-h-screen bg-black text-white p-10">
            <div className="max-w-7xl mx-auto">

                <div className="flex items-center justify-between mb-8">

                    <h1 className="text-4xl font-bold">
                        Compras Desactivadas
                    </h1>

                    <a
                        href="/compras"
                        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg"
                    >
                        ← Volver a Compras
                    </a>

                </div>

                {compras.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
                        <p className="text-xl font-semibold">
                            No hay compras desactivadas
                        </p>
                    </div>
                ) : (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">

                        <table className="w-full">
                            <thead className="bg-zinc-800">
                                <tr>
                                    <th className="text-left p-4">
                                        Factura
                                    </th>

                                    <th className="text-left p-4">
                                        Proveedor
                                    </th>

                                    <th className="text-left p-4">
                                        Productos
                                    </th>

                                    <th className="text-left p-4">
                                        Total
                                    </th>

                                    <th className="text-left p-4">
                                        Fecha
                                    </th>

                                    <th className="text-left p-4">
                                        Estado
                                    </th>

                                    <th className="text-left p-4">
                                        Detalle
                                    </th>

                                    <th className="text-left p-4">
                                        Acción
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {compras.map((compra) => {

                                    const total = compra.items.reduce(
                                        (acum, item) =>
                                            acum +
                                            item.quantity *
                                            item.costPrice,
                                        0
                                    );

                                    return (
                                        <tr
                                            key={compra.id}
                                            className="border-t border-zinc-800"
                                        >
                                            <td className="p-4 font-medium">
                                                {compra.invoice}
                                            </td>

                                            <td className="p-4">
                                                {compra.provider.name}
                                            </td>

                                            <td className="p-4">
                                                {compra.items.length}
                                            </td>

                                            <td className="p-4 text-green-400 font-bold">
                                                ${total}
                                            </td>

                                            <td className="p-4 text-zinc-400">
                                                {new Date(
                                                    compra.createdAt
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="p-4">
                                                <span className="bg-red-600 px-3 py-1 rounded text-sm">
                                                    Desactivada
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <a
                                                    href={`/compras/${compra.id}/detalle`}
                                                    className="bg-blue-600 px-3 py-2 rounded"
                                                >
                                                    Ver
                                                </a>
                                            </td>

                                            <td className="p-4">
                                                <ActivatePurchaseButton
                                                    purchaseId={compra.id}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>

                    </div>
                )}

            </div>
        </main>
    );
}