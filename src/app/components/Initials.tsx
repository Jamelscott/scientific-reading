import { useNavigate } from "react-router";
import { useTeacherStore } from "../../stores";

interface InitialsProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Initials({ size = "md", className = "" }: InitialsProps) {
  const navigate = useNavigate();
  const teacher = useTeacherStore((state) => state.teacher);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      // Always use first name initial + last name initial
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    // Fallback: use first two characters if only one name provided
    return fullName.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: "w-12 h-12 text-base",
    md: "w-16 h-16 text-lg",
    lg: "w-20 h-20 text-xl",
    xl: "w-24 h-24 text-2xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold ${className} cursor-pointer`}
      style={{ background: "#38b6ff", color: "#ffffff" }}
      onClick={() => navigate("/profile")}
    >
      {getInitials(teacher?.name || "")}
    </div>
  );
}
