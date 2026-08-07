import { fireEvent, render, screen } from "@testing-library/react";
import { CartProvider, useCart } from "@/components/commerce/cart-provider";
import { CartPageClient } from "@/components/commerce/cart-page-client";
import type { Product } from "@/lib/catalog/model";

const product = { id:"p1", slug:"mint", sku:"1", name:"HQD מנטה", brand:"HQD", flavor:"מנטה", nicotineMg:15, strengthLevel:"medium", retailPrice:100, sourcePrice:80, stock:2, active:true, packSize:1, images:[], categories:[] } satisfies Product;
function Seed() { const { dispatch } = useCart(); return <button onClick={() => dispatch({ type:"add", product, quantity:2 })}>seed</button>; }

it("shows empty and populated cart states", () => {
  render(<CartProvider><Seed /><CartPageClient /></CartProvider>);
  expect(screen.getByText("העגלה עדיין ריקה")).toBeInTheDocument();
  fireEvent.click(screen.getByText("seed"));
  expect(screen.getByRole("link", { name: "מנטה" })).toBeInTheDocument();
  expect(screen.getAllByText("200.00 ₪").length).toBeGreaterThan(0);
  expect(screen.getByText("חינם")).toBeInTheDocument();
});
