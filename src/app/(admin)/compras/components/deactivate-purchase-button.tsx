"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deactivatePurchase } from "../actions/deactivate-purchase";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  purchaseId: string;
};

export function DeactivatePurchaseButton({
  purchaseId,
}: Props) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleDeactivate() {
    setLoading(true);

    try {
      await deactivatePurchase(purchaseId);

      toast.success(
        "Compra desactivada correctamente"
      );

      setTimeout(() => {
        router.refresh();
      }, 1000);

    } catch {
      toast.error(
        "Error al desactivar la compra"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="bg-orange-600 px-4 py-2 rounded"
        >
          Desactivar
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Desactivar compra?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-400">
            La compra dejará de aparecer en el listado,
            pero conservará todo su historial.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-white">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeactivate}
            className="bg-orange-600"
            disabled={loading}
          >
            {loading
              ? "Desactivando..."
              : "Sí, desactivar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}