"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCategory } from "../actions/delete-category";

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
  categoryId: string;
};

export function DeactivateCategoryButton({ categoryId }: Props) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleDeactivate() {
    setLoading(true);

    try {
      await deleteCategory(categoryId);

      toast.success("Categoría desactivada correctamente");

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error("Error al desactivar la categoría");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button" className="bg-orange-600 px-4 py-2 rounded">
          Desactivar
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desactivar categoría?</AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-400">
            La categoría dejará de aparecer en el listado pero conservará su
            historial.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDeactivate} disabled={loading}>
            {loading ? "Desactivando..." : "Desactivar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
