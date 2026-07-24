import { CartPageClient } from "@/components/commerce/cart-page-client";
export const metadata = { title: "סל קניות", robots: { index: false, follow: false } };
export default function CartPage() {
  return <CartPageClient />;
}
