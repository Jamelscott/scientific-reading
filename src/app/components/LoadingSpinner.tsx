import { Loader, Loader2, LoaderCircle, LoaderPinwheel } from "lucide-react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
  isVisible?: boolean;
}

export function LoadingSpinner({
  fullScreen = false,
  message,
  isVisible = true,
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div
        className={`fixed bottom-5 right-5 flex flex-col items-center gap-4 z-[9999] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {" "}
        <Loader2
          className="w-12 h-12 animate-spin"
          style={{
            color: "#004aad",
          }}
        />
        {message && (
          <p className="text-lg font-medium" style={{ color: "#004aad" }}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2
        className="w-8 h-8 animate-spin"
        style={{
          color: "#004aad",
          animationDuration: "2s",
        }}
      />
    </div>
  );
}
