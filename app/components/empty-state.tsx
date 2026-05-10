type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
};

export default function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-2 pb-16 px-5">
      <div className="text-border">{icon}</div>
      <p className="text-[15px] font-medium text-foreground">{title}</p>
      {subtitle && <p className="text-[13px] text-muted">{subtitle}</p>}
    </div>
  );
}
