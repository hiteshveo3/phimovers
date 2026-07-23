import Image from "next/image";
import { priceLabel, type Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  const isFree = product.price.toLowerCase() === "free";
  return (
    <a
      href="#"
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:bg-cream"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 80vw, 300px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold leading-snug text-content">{product.title}</h3>
          <span
            className={
              isFree
                ? "shrink-0 rounded-pill bg-[#163300]/10 px-2.5 py-1 text-xs font-bold text-[#163300]"
                : "shrink-0 text-xs font-bold text-content"
            }
          >
            {priceLabel(product.price)}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted">
          {product.author} · {product.category}
        </p>
      </div>
    </a>
  );
}
