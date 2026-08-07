export interface CartLine { id: string; name: string; price: number; quantity: number }
export function calculateTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = subtotal >= 199 || subtotal === 0 ? 0 : 25;
  return { subtotal, shipping, total: subtotal + shipping };
}
