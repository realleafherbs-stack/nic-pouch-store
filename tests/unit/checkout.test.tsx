import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider, useCart } from "@/components/commerce/cart-provider";
import { CheckoutClient } from "@/components/commerce/checkout-client";
import type { Product } from "@/lib/catalog/model";

const product = { id:"p1", slug:"mint", sku:"1", name:"HQD מנטה", brand:"HQD", flavor:"מנטה", nicotineMg:15, strengthLevel:"medium", retailPrice:100, sourcePrice:80, stock:2, active:true, packSize:1, images:[], categories:[] } satisfies Product;
function Seed() { const { dispatch } = useCart(); return <button onClick={() => dispatch({ type:"add", product, quantity:2 })}>seed</button>; }

it("requires a cart and renders a checkout summary", () => {
  render(<CartProvider><Seed /><CheckoutClient /></CartProvider>);
  expect(screen.getByText("אין מוצרים לתשלום")).toBeInTheDocument();
  fireEvent.click(screen.getByText("seed"));
  expect(screen.getByText("ההזמנה שלכם")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /שמירת הזמנה/ })).toBeInTheDocument();
});
