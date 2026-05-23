import Image from "next/image";
import { storeMeta } from "@/app/lib/items";

type Size = "sm" | "md";

type Props = {
  name: string;
  size?: Size;
};

const sizeClasses: Record<Size, { box: string; text: string }> = {
  sm: { box: "w-10 h-10 rounded-xl", text: "text-[11px]" },
  md: { box: "w-11 h-11 rounded-xl", text: "text-[13px]" },
};

export default function StoreLogo({ name, size = "sm" }: Props) {
  const meta = storeMeta[name] ?? { initials: name.slice(0, 2).toUpperCase(), color: "bg-muted" };
  const s = sizeClasses[size];

  if (meta.logo) {
    return (
      <div className={`${s.box} overflow-hidden shrink-0 border border-border relative`}>
        <Image src={meta.logo} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`${s.box} ${meta.color} flex items-center justify-center shrink-0`}>
      <span className={`${s.text} font-bold text-white tracking-wide`}>{meta.initials}</span>
    </div>
  );
}
