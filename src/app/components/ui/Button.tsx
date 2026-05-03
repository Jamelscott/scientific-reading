import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  leadingIcon?: ReactNode; // optional leading icon
}

export function Button({
  label,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
  leadingIcon,
}: ButtonProps) {
  const { t } = useTranslation();
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 rounded-xl transition-all";

  const variantStyles = {
    primary: "hover:bg-[#003a86] bg-[#004aad] text-white",
    secondary: "hover:bg-gray-50 hover:border-gray-200 border text-black",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {leadingIcon ? (
        <span className="inline-flex items-center mr-2">{leadingIcon}</span>
      ) : null}
      {t(label)}
    </button>
  );
}
