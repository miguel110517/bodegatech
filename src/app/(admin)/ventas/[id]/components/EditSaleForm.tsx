"use client";

import { useState } from "react";
import { toast } from "sonner";

import CustomerPicker from "../../components/customer-picker";
import ProductPicker from "../../components/product-picker";
import SaleCart from "../../components/sale-cart";
import SaleSummary from "../../components/sale-summary";

import { updateSale } from "../../actions/update-sale";

type Props = {
venta: any;
clientes: any[];
productos: any[];
};

export default function EditSaleForm({
venta,
clientes,
productos,
}: Props) {
const [customerId, setCustomerId] = useState(
venta.customerId
);

const [selectedCustomer, setSelectedCustomer] =
useState(venta.customer);

const [cart, setCart] = useState(
venta.items.map((item: any) => ({
id: item.product.id,
name: item.product.name,
salePrice: item.salePrice,
stock: item.product.stock,
quantity: item.quantity,
}))
);

const [discount, setDiscount] = useState(
String(venta.discount || 0)
);

function addProduct(product: any) {
const exists = cart.find(
(item: any) => item.id === product.id
);

```
if (exists) {
  setCart(
    cart.map((item: any) =>
      item.id === product.id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    )
  );

  return;
}

setCart([
  ...cart,
  {
    ...product,
    quantity: 1,
  },
]);
```

}

function increase(productId: string) {
setCart(
cart.map((item: any) =>
item.id === productId
? {
...item,
quantity: item.quantity + 1,
}
: item
)
);
}

function decrease(productId: string) {
setCart(
cart
.map((item: any) =>
item.id === productId
? {
...item,
quantity: item.quantity - 1,
}
: item
)
.filter((item: any) => item.quantity > 0)
);
}

function removeProduct(productId: string) {
setCart(
cart.filter(
(item: any) => item.id !== productId
)
);
}

const subtotal = cart.reduce(
(acc: number, item: any) =>
acc + item.salePrice * item.quantity,
0
);

const total =
subtotal - Number(discount || 0);

return (
<form
action={async (formData) => {
try {
await updateSale(
venta.id,
formData
);

      toast.success(
        "Venta editada correctamente"
      );

      setTimeout(() => {
        window.location.href =
          "/ventas";
      }, 1000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al editar venta"
      );
    }
  }}
  className="grid lg:grid-cols-2 gap-6"
>
  <input
    type="hidden"
    name="customerId"
    value={customerId}
  />

  <input
    type="hidden"
    name="invoice"
    value={venta.invoice || ""}
  />

  {cart.map((item: any) => (
    <div key={item.id}>
      <input
        type="hidden"
        name="productId"
        value={item.id}
      />

      <input
        type="hidden"
        name="quantity"
        value={item.quantity}
      />
    </div>
  ))}

  <div className="bg-zinc-900 p-6 rounded-xl">
    <h2 className="text-2xl font-bold mb-4">
      Productos
    </h2>

    <ProductPicker
      products={productos}
      onSelect={addProduct}
    />
  </div>

  <div className="bg-zinc-900 p-6 rounded-xl">
    <h2 className="text-2xl font-bold mb-4">
      Editar Venta
    </h2>

    <CustomerPicker
      customers={clientes}
      selectedCustomer={
        selectedCustomer
      }
      onSelect={(customer) => {
        setCustomerId(customer.id);
        setSelectedCustomer(
          customer
        );
      }}
    />

    <SaleCart
      cart={cart}
      increase={increase}
      decrease={decrease}
      removeProduct={removeProduct}
    />

    <SaleSummary
      subtotal={subtotal}
      discount={discount}
      setDiscount={setDiscount}
      total={total}
    />

    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-xl text-xl font-bold mt-6"
    >
      GUARDAR CAMBIOS
    </button>
  </div>
</form>
);
}
