import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { getProduct, products } from "@/lib/catalog/local-repository";

const labels = { mild: "עדין", medium: "בינוני", strong: "חזק", "extra-strong": "חזק מאוד" };
export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: product.name, description: `${product.name} במחיר ${product.retailPrice.toFixed(2)} ₪. משלוח חינם מעל 199 ₪.`, alternates: { canonical: `/shop/${product.slug}` } };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id && (item.brand === product.brand || item.strengthLevel === product.strengthLevel)).slice(0, 4);
  const schema = { "@context": "https://schema.org", "@type": "Product", name: product.name, image: product.images, sku: product.sku, brand: { "@type": "Brand", name: product.brand }, offers: { "@type": "Offer", price: product.retailPrice, priceCurrency: "ILS", availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `https://nicpouch.co.il/shop/${product.slug}` } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container product-page">
        <div className="gallery-main">{product.images[0] ? <img src={product.images[0]} alt={product.name} /> : <span className="can-placeholder">{product.brand}</span>}</div>
        <section className="product-summary">
          <p className="eyebrow">{product.brand}</p><h1>{product.flavor || product.name}</h1><p>{product.name}</p>
          <div className="product-price">{product.retailPrice.toFixed(2)} ₪</div>
          <div className="facts"><div><span>עוצמה</span><strong>{product.strengthLevel ? labels[product.strengthLevel] : "לא צוין"}</strong></div><div><span>ניקוטין</span><strong>{product.nicotineMg ? `${product.nicotineMg} מ״ג` : "לא צוין"}</strong></div><div><span>אריזה</span><strong>{product.packSize > 1 ? `${product.packSize} יח׳` : "יחידה"}</strong></div></div>
          <button className="button" style={{ width: "100%" }}>הוספה לסל</button>
          <p>במלאי · משלוח עד 3 ימי עסקים · חינם מעל 199 ₪</p>
          <div className="warning"><strong>חשוב לדעת</strong><br />ניקוטין הוא חומר ממכר. המוצר מיועד לבגירים בלבד ואינו מומלץ למי שאינו משתמש בניקוטין.</div>
        </section>
      </div>
      <section className="section section-alt"><div className="container"><div className="section-heading"><h2>אולי יתאים לכם</h2></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section>
    </>
  );
}
