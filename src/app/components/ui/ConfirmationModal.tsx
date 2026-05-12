import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="p-6 border-b flex items-center justify-between"
          style={{ borderColor: "#dff3ff" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: "#004aad" }}>
            {t("common.confirmDelete")}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: "#004aad" }} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-base" style={{ color: "#000000" }}>
            {message}
          </p>
        </div>

        <div
          className="p-6 border-t flex gap-3 justify-end"
          style={{ borderColor: "#dff3ff" }}
        >
          <Button
            label="common.cancel"
            onClick={onCancel}
            variant="secondary"
          />
          <Button
            label="common.confirm"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}
