import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import type { Item, StockStatus } from "@/app/lib/types";
import { toSlug, stockStatus, stockLabel, stockDot } from "@/app/lib/utils";
import { categoryIcon, accentFor } from "@/app/lib/categories";

function ItemIcon({ category }: { category: string }) {
  const Icon = categoryIcon[category] ?? Package;
  return <Icon size={18} strokeWidth={1.5} />;
}

type ItemCardProps = {
  item: Item;
  subtitle?: string;
  price: number;
  stock?: number;
  showCategory?: boolean;
  onClick?: () => void;
};

export default function ItemCard({ item, subtitle, price, stock, showCategory, onClick }: ItemCardProps) {
  const status: StockStatus | null = stock != null ? stockStatus(stock) : null;

  return (
    <Link
      href={`/item/${toSlug(item.name)}`}
      onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-surface active:opacity-70 transition-opacity"
    >
      <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 text-muted overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} width={44} height={44} className="w-full h-full object-contain" />
        ) : (
          <ItemIcon category={item.category} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{item.name}</p>
        {subtitle && <p className="text-[12px] text-muted mt-0.5 truncate">{subtitle}</p>}
        {status && status !== "in_stock" && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`w-2 h-2 rounded-full ${stockDot[status]}`} />
            <span className="text-[12px] text-muted">{stockLabel[status]}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <p className="text-[15px] font-bold text-foreground">€{price.toFixed(2)}</p>
        {showCategory && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${accentFor(item.category)}`}>
            {item.category}
          </span>
        )}
      </div>
    </Link>
  );
}
