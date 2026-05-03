import { X } from "lucide-react";

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-xl hover:bg-[#dff3ff] active:bg-[#8ba8bb] bg-white transition-all"
    >
      <X className="w-5 h-5 text-[#004aad]" />
    </button>
  );
}
