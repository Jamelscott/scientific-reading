import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";

interface DeleteTeacherModalProps {
  isOpen: boolean;
  teacherName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTeacherModal({
  isOpen,
  teacherName,
  onConfirm,
  onCancel,
}: DeleteTeacherModalProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setError("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (inputValue.trim() === teacherName.trim()) {
      onConfirm();
      setInputValue("");
      setError("");
    } else {
      setError(t("school.nameDoesNotMatch"));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        style={{ background: "#ffffff", border: "2px solid #ff5757" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "#fff5f5" }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: "#ff5757" }} />
            </div>
            <h2 className="text-2xl" style={{ color: "#ff5757" }}>
              {t("school.deleteTeacher")}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-xl transition-all"
            style={{ background: "#f5f5f5" }}
          >
            <X className="w-5 h-5" style={{ color: "#666" }} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-base mb-4" style={{ color: "#000000" }}>
              {t("school.confirmRemoveTeacher", { name: teacherName })}
            </p>
            <p className="text-sm mb-2" style={{ color: "#666" }}>
              {t("school.typeNameToConfirm")}
            </p>
            <div
              className="p-3 rounded-lg mb-4"
              style={{ background: "#fff5f5", border: "1px solid #ffd5d5" }}
            >
              <p
                className="text-sm font-mono font-semibold"
                style={{ color: "#ff5757" }}
              >
                {teacherName}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#000000" }}>
              {t("school.teacherNameLabel")}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#ffffff",
                borderColor: error ? "#ff5757" : "#ddd",
              }}
              placeholder={t("school.typeNamePlaceholder")}
              autoFocus
            />
            {error && (
              <p className="text-sm mt-2" style={{ color: "#ff5757" }}>
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={onCancel}
              label="common.cancel"
              variant="secondary"
              className="flex-1"
            />
            <button
              onClick={handleConfirm}
              disabled={!inputValue.trim()}
              className="flex-1 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: inputValue.trim() ? "#ff5757" : "#cccccc",
                color: "#ffffff",
              }}
            >
              {t("school.deleteTeacherButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
