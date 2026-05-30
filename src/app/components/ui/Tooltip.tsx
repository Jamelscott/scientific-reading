import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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

export function Tooltip({ label, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      let top = 0;
      let left = 0;
      const gap = 16; // 16px gap between trigger and tooltip

      // Calculate position based on position prop
      switch (position) {
        case "top":
        case "top-left":
        case "top-right":
          top = triggerRect.top + scrollY - tooltipRect.height - gap;
          break;
        case "bottom":
        case "bottom-left":
        case "bottom-right":
          top = triggerRect.bottom + scrollY + gap;
          break;
        case "left":
          top =
            triggerRect.top +
            scrollY +
            (triggerRect.height - tooltipRect.height) / 2;
          break;
        case "right":
          top =
            triggerRect.top +
            scrollY +
            (triggerRect.height - tooltipRect.height) / 2;
          break;
      }

      switch (position) {
        case "top":
        case "bottom":
          left =
            triggerRect.left +
            scrollX +
            (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "top-left":
        case "bottom-left":
          left = triggerRect.left + scrollX;
          break;
        case "top-right":
        case "bottom-right":
          left = triggerRect.right + scrollX - tooltipRect.width;
          break;
        case "left":
          left = triggerRect.left + scrollX - tooltipRect.width - gap;
          break;
        case "right":
          left = triggerRect.right + scrollX + gap;
          break;
      }

      // Keep tooltip within viewport bounds
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const edgePadding = 20; // Padding from window edges

      if (left < edgePadding) left = edgePadding;
      if (left + tooltipRect.width > viewportWidth - edgePadding) {
        left = viewportWidth - tooltipRect.width - edgePadding;
      }

      if (top < edgePadding) top = edgePadding;
      if (top + tooltipRect.height > viewportHeight + scrollY - edgePadding) {
        top = viewportHeight + scrollY - tooltipRect.height - edgePadding;
      }

      setCoords({ top, left });
    }
  }, [visible, position]);

  const getArrowPosition = () => {
    if (!position.includes("top") && !position.includes("bottom")) {
      return null;
    }

    if (!triggerRef.current || !tooltipRef.current) {
      return null;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;

    // Calculate the center of the trigger element relative to the tooltip's left edge
    const triggerCenter = triggerRect.left + scrollX + triggerRect.width / 2;
    const arrowLeft = triggerCenter - coords.left;

    const isTop = position.includes("top");
    const arrowClass = "absolute border-6 border-transparent";

    const arrowStyle = isTop
      ? {
          top: "100%",
          left: `${arrowLeft}px`,
          transform: "translateX(-50%)",
          borderTopColor: "#004aad",
        }
      : {
          bottom: "100%",
          left: `${arrowLeft}px`,
          transform: "translateX(-50%)",
          borderBottomColor: "#004aad",
        };

    return <div className={arrowClass} style={arrowStyle} />;
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-flex items-center"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed px-4 py-3 text-xs rounded-md whitespace-nowrap pointer-events-none transition-opacity duration-200"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              background: "#004aad",
              color: "#ffffff",
              boxShadow: "0 6px 18px rgba(6,30,78,0.12)",
              zIndex: 9999,
              opacity: visible ? 1 : 0,
            }}
          >
            <span className="flex justify-start items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              {label}
            </span>
            {getArrowPosition()}
          </div>,
          document.body,
        )}
    </>
  );
}

export default Tooltip;
