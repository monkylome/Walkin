import { MapPinIcon, ClockIcon } from "@/app/components/icons";

type Props = {
  distance: string;
  walkTime: string;
};

export default function DistanceChips({ distance, walkTime }: Props) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 flex items-center gap-2.5 p-3 rounded-2xl bg-surface border border-border">
        <MapPinIcon className="text-primary shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-foreground">{distance}</p>
          <p className="text-[11px] text-muted">away</p>
        </div>
      </div>
      <div className="flex-1 flex items-center gap-2.5 p-3 rounded-2xl bg-surface border border-border">
        <ClockIcon className="text-primary shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-foreground">{walkTime}</p>
          <p className="text-[11px] text-muted">walk</p>
        </div>
      </div>
    </div>
  );
}
