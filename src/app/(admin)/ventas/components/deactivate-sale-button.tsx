"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ban } from "lucide-react";
import { deactivateSale } from "../actions/deactivate-sale";

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
  saleId: string;
};

export function DeactivateSaleButton({
  saleId,
}: Props) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleDeactivate() {
    setLoading(true);

    try {
      await deactivateSale(saleId);

      toast.success(
        "Venta desactivada correctamente"
      );

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch {
      toast.error(
        "Error al desactivar la venta"
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
          title="Desactivar"
          className="bg-red-600 hover:bg-red-700 p-2 rounded"
        >
          <Ban size={18} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Desactivar venta?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-400">
            La venta dejará de aparecer en el listado,
            pero conservará todo su historial.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-white">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeactivate}
            className="bg-red-600 hover:bg-red-700"
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