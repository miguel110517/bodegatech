"use client";

import { useState } from "react";

type Customer = {
  id: string;
  name: string;
  document?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
};

type Props = {
  customers: Customer[];
  selectedCustomer?: Customer | null;
  onSelect: (customer: Customer) => void;
};

export default function CustomerPicker({
  customers,
  selectedCustomer,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.document?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 text-left mb-6"
      >
        {selectedCustomer ? (
          <>
            <div className="font-bold text-white">{selectedCustomer.name}</div>

            <div className="text-sm text-zinc-400">
              Documento: {selectedCustomer.document || "-"}
            </div>
          </>
        ) : (
          <span className="text-zinc-400">Seleccionar cliente</span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-2xl h-[80vh] rounded-xl border border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Seleccionar Cliente
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 rounded bg-zinc-800 text-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => {
                    onSelect(customer);
                    setOpen(false);
                  }}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-xl p-4 text-left"
                >
                  <p className="font-bold text-white">{customer.name}</p>

                  <p className="text-zinc-400 text-sm">
                    Documento: {customer.document || "-"}
                  </p>

                  <p className="text-zinc-400 text-sm">
                    Teléfono: {customer.phone || "-"}
                  </p>

                  <p className="text-zinc-400 text-sm">
                    WhatsApp: {customer.whatsapp || "-"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
