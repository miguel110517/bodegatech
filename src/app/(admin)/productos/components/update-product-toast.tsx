"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function UpdateProductToast() {
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;

    shown.current = true;

    toast.success(
      "Producto actualizado correctamente"
    );
  }, []);

  return null;
}