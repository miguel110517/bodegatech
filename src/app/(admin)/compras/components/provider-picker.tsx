"use client";

import { useState } from "react";

type Provider = {
  id: string;
  name: string;
  document?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
};

type Props = {
  providers: Provider[];
  onSelect: (provider: Provider) => void;
};

export default function ProviderPicker({
  providers,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      provider.document
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      provider.phone
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 text-left"
      >
        Seleccionar proveedor
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">

          <div className="bg-zinc-900 w-full max-w-3xl h-[80vh] rounded-xl border border-zinc-800 flex flex-col">

            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">

              <h2 className="text-xl font-bold text-white">
                Seleccionar Proveedor
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white text-2xl"
              >
                ×
              </button>

            </div>

            <div className="p-4">
              <input
                type="text"
                placeholder="Buscar por nombre, documento o teléfono..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full p-3 rounded bg-zinc-800 text-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">

              {filteredProviders.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => {
                    onSelect(provider);
                    setOpen(false);
                  }}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-lg p-3 text-left"
                >
                  <p className="font-bold text-white">
                    {provider.name}
                  </p>

                  <p className="text-zinc-400 text-sm">
                    Documento: {provider.document || "-"}
                  </p>

                  <p className="text-zinc-400 text-sm">
                    Teléfono: {provider.phone || "-"}
                  </p>

                  <p className="text-zinc-400 text-sm">
                    Email: {provider.email || "-"}
                  </p>
                </button>
              ))}

              {filteredProviders.length === 0 && (
                <div className="text-center text-zinc-400 py-10">
                  No se encontraron proveedores
                </div>
              )}

            </div>

          </div>

        </div>
      )}
    </>
  );
}