import { useState } from "react";
import { Info } from "lucide-react";

type TooltipPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  position?: TooltipPosition;
}

const positionStyles: Record<
  TooltipPosition,
  { tooltip: string; arrow: string; arrowBorder: React.CSSProperties }
> = {
  top: {
    tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-4",
    arrow:
      "absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent",
    arrowBorder: { borderTopColor: "#004aad" },
  },
  "top-left": {
    tooltip: "bottom-full left-0 mb-4",
    arrow: "absolute top-full left-2 border-6 border-transparent",
    arrowBorder: { borderTopColor: "#004aad" },
  },
  "top-right": {
    tooltip: "bottom-full right-0 mb-4",
    arrow: "absolute top-full right-2 border-6 border-transparent",
    arrowBorder: { borderTopColor: "#004aad" },
  },
  "bottom-left": {
    tooltip: "top-full left-0 mt-4",
    arrow: "absolute bottom-full left-2 border-6 border-transparent",
    arrowBorder: { borderBottomColor: "#004aad" },
  },
  "bottom-right": {
    tooltip: "top-full right-0 mt-4",
    arrow: "absolute bottom-full right-2 border-6 border-transparent",
    arrowBorder: { borderBottomColor: "#004aad" },
  },
  bottom: {
    tooltip: "top-full left-1/2 -translate-x-1/2 mt-4",
    arrow:
      "absolute bottom-full left-1/2 -translate-x-1/2 border-6 border-transparent",
    arrowBorder: { borderBottomColor: "#004aad" },
  },
  left: {
    tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
    arrow:
      "absolute left-full top-1/2 -translate-y-1/2 border-6 border-transparent",
    arrowBorder: { borderLeftColor: "#004aad" },
  },
  right: {
    tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
    arrow:
      "absolute right-full top-1/2 -translate-y-1/2 border-6 border-transparent",
    arrowBorder: { borderRightColor: "#004aad" },
  },
};

export function Tooltip({ label, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const { tooltip, arrow, arrowBorder } = positionStyles[position];

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute ${tooltip} px-4 py-3 text-xs rounded-md whitespace-nowrap z-99 pointer-events-none transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{
            background: "#004aad",
            color: "#ffffff",
            boxShadow: "0 6px 18px rgba(6,30,78,0.12)",
          }}
        >
          <span className="flex justify-start items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {label}
          </span>
          <div className={arrow} style={arrowBorder} />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
