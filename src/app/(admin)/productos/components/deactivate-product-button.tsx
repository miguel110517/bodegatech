"use client";

import { toast } from "sonner";
import { useState } from "react";
import { deactivateProduct } from "../actions/deactivate-product";
import { useRouter } from "next/navigation";
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
    productId: string;
};

export function DeactivateProductButton({ productId }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleDeactivate() {
        setLoading(true);

        try {
            await deactivateProduct(productId);

            toast.success(
                "Producto desactivado con éxito"
            );

            setTimeout(() => {
                router.refresh();
            }, 1200);
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
                        ¿Desactivar producto?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-zinc-400">
                        Este producto dejará de aparecer en el inventario,
                        pero su historial se conservará intacto.
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
                        {loading ? "Desactivando..." : "Sí, desactivar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}