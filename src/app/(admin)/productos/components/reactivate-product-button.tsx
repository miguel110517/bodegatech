"use client";

import { toast } from "sonner";
import { reactivateProduct } from "../actions/reactivate-product";

export function ReactivateProductButton({
  productId,
}: {
  productId: string;
}) {
  async function handleClick() {
    await reactivateProduct(
      productId
    );

    toast.success(
      "Producto reactivado con éxito"
    );
  }

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 px-4 py-2 rounded"
    >
      Reactivar
    </button>
  );
}