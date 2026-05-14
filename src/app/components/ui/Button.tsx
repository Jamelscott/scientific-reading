import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "caution" | "error" | "success" | "clear";
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  leadingIcon?: ReactNode; // optional leading icon
  size?: "small" | "base" | "large";
}

export function Button({
  label,
  onClick,
  variant = "primary",
  type = "button",
  size = "base",
  className = "",
  disabled = false,
  leadingIcon,
}: ButtonProps) {
  const { t } = useTranslation();
  const baseStyles =
    "inline-flex items-center justify-center transition-all active:scale-95";

  const sizeStyles = {
    small: "py-2 px-4 text-sm rounded-lg",
    base: "px-6 py-3 rounded-xl",
    large: "px-8 py-4 text-lg rounded-xl",
  };

  const variantStyles = {
    primary: "hover:bg-[#003a86] active:bg-[#00275a] bg-[#004aad] text-white",
    secondary:
      "hover:bg-gray-50 hover:border-gray-200 active:bg-gray-100 border text-black",
    caution:
      "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white",
    error: "bg-[#d32f2f] hover:bg-[#b71c1c] active:bg-[#7f1d1d] text-white",
    success: "bg-[#2e7d32] hover:bg-[#1b5e20] active:bg-[#17451a] text-white",
    clear: "bg-[#666] hover:bg-[#555] active:bg-[#444] text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {leadingIcon ? (
        <span className="inline-flex items-center mr-2">{leadingIcon}</span>
      ) : null}
      {t(label)}
    </button>
  );
}
