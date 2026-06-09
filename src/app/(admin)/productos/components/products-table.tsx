"use client";

import { useState } from "react";
import { DeactivateProductButton } from "./deactivate-product-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

export function ProductsTable({ productos }: any) {
  const [search, setSearch] = useState("");

  const filteredProducts = productos.filter((producto: any) => {
    const text = search.toLowerCase();

    return (
      producto.name.toLowerCase().includes(text) ||
      producto.code.toLowerCase().includes(text) ||
      producto.brand?.toLowerCase().includes(text)
    );
  });

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, código o marca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 outline-none focus:border-blue-500 transition"
        />
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center">
          <p className="text-2xl font-bold">Producto no encontrado</p>

          <p className="text-zinc-400 mt-2">
            No existe ningún producto con ese nombre, código o marca.
          </p>
        </div>
      )}

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Venta</TableHead>
              <TableHead>Oferta</TableHead>
              <TableHead>Utilidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.map((producto: any) => {
              const utilidad =
                (producto.offerPrice ?? producto.salePrice) -
                producto.costPrice;

              return (
                <TableRow key={producto.id}>
                  <TableCell>{producto.code}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      {producto.imageUrl && (
                        <img
                          src={producto.imageUrl}
                          alt={producto.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}

                      <div>
                        <p className="font-bold">{producto.name}</p>

                        <p className="text-zinc-400 text-sm">
                          {producto.category.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{producto.brand || "-"}</TableCell>

                  <TableCell>
                    <span
                      className={
                        producto.stock <= producto.minStock
                          ? "text-red-400 font-bold"
                          : "text-white"
                      }
                    >
                      {producto.stock}
                    </span>
                  </TableCell>

                  <TableCell>
                    ${producto.salePrice.toLocaleString("es-CO")}
                  </TableCell>

                  <TableCell>
                    $
                    {(producto.offerPrice ?? producto.salePrice).toLocaleString(
                      "es-CO",
                    )}
                  </TableCell>

                  <TableCell
                    className={utilidad > 0 ? "text-green-400" : "text-red-400"}
                  >
                    ${utilidad.toLocaleString("es-CO")}
                  </TableCell>

                  <TableCell>
                    {producto.stock === 0 ? (
                      <Badge variant="destructive">Agotado</Badge>
                    ) : producto.stock <= producto.minStock ? (
                      <Badge>Stock Bajo</Badge>
                    ) : (
                      <Badge className="bg-green-600">Disponible</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <a
                        href={`/productos/${producto.id}`}
                        className="bg-yellow-600 px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </a>

                      <a
                        href={`/productos/${producto.id}/historial`}
                        className="bg-blue-600 px-3 py-1 rounded text-sm"
                      >
                        Historial
                      </a>

                      <DeactivateProductButton productId={producto.id} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
