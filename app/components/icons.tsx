type IconProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

const baseProps = (size: number, strokeWidth: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...(className ? { className } : {}),
});

export function SearchIcon({ size = 15, strokeWidth = 2, className }: IconProps = {}) {
  return (
    <svg {...baseProps(size, strokeWidth, className)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function XCircleIcon({ size = 15, strokeWidth = 2.2, className }: IconProps = {}) {
  return (
    <svg {...baseProps(size, strokeWidth, className)}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6m0-6 6 6" />
    </svg>
  );
}

export function XIcon({ size = 14, strokeWidth = 2.5, className }: IconProps = {}) {
  return (
    <svg {...baseProps(size, strokeWidth, className)}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 16, strokeWidth = 2.2, className }: IconProps = {}) {
  return (
    <svg {...baseProps(size, strokeWidth, className)}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16, strokeWidth = 2, className }: IconProps = {}) {
  return (
    <svg {...baseProps(size, strokeWidth, className)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function MapPinIcon({ size = 16, strokeWidth = 1.8, className }: IconProps = {}) {
  return (
    <svg {...baseProps(size, strokeWidth, className)}>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function MapPinFilledIcon({ size = 13, strokeWidth = 2.5, className }: IconProps = {}) {
  return (
    <svg {...baseProps(size, strokeWidth, className)}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function ClockIcon({ size = 16, strokeWidth = 1.8, className }: IconProps = {}) {
  return (
    <svg {...baseProps(size, strokeWidth, className)}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function StoreBuildingIcon({ size = 18, strokeWidth = 1.5, className }: IconProps = {}) {
  return (
    <svg {...baseProps(size, strokeWidth, className)}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function BookmarkIcon({ size = 16, strokeWidth = 2, className, filled = false }: IconProps & { filled?: boolean } = {}) {
  return (
    <svg
      {...baseProps(size, strokeWidth, className)}
      fill={filled ? "currentColor" : "none"}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
