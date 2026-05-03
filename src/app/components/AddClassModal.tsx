import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { useClassStore } from "../../stores";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddClassModal({ isOpen, onClose }: AddClassModalProps) {
  const { t } = useTranslation();
  const addClass = useClassStore((state) => state.addClass);
  const [className, setClassName] = useState("");
  const [grade, setGrade] = useState("maternelle");
  const [errors, setErrors] = useState({
    className: "",
    grade: "",
  });

  const handleSubmit = () => {
    const newErrors = {
      className: "",
      grade: "",
    };

    if (!className.trim()) {
      newErrors.className = t("dashboard.errors.classNameRequired");
    }

    if (!grade) {
      newErrors.grade = t("dashboard.errors.gradeRequired");
    }

    if (newErrors.className || newErrors.grade) {
      setErrors(newErrors);
      return;
    }

    addClass({
      name: className.trim(),
      grade,
      studentCount: 0,
    });
    setClassName("");
    setGrade("maternelle");
    setErrors({ className: "", grade: "" });
    onClose();
  };

  const handleClose = () => {
    setClassName("");
    setGrade("maternelle");
    setErrors({ className: "", grade: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(1px)",
      }}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        style={{ background: "#ffffff", border: "2px solid #cccccc" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ color: "#004aad" }}>
            {t("dashboard.addClass")}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl transition-all"
            style={{ background: "#dff3ff" }}
          >
            <X className="w-5 h-5" style={{ color: "#004aad" }} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2" style={{ color: "#000000" }}>
              {t("dashboard.className")}
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: errors.className ? "#ff5757" : "#38b6ff",
              }}
              placeholder={t("dashboard.classExample")}
            />
            {errors.className && (
              <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                {errors.className}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#000000" }}>
              {t("dashboard.grade")}
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: errors.grade ? "#ff5757" : "#38b6ff",
                color: "#000000",
              }}
            >
              <option value="maternelle">
                {t("dashboard.gradeOptions.maternelle")}
              </option>
              <option value="1re">{t("dashboard.gradeOptions.1re")}</option>
              <option value="2e">{t("dashboard.gradeOptions.2e")}</option>
            </select>
            {errors.grade && (
              <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                {errors.grade}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleClose}
              label="common.cancel"
              variant="secondary"
              className="flex-1"
            />
            <Button
              onClick={handleSubmit}
              label="dashboard.createClass"
              variant="primary"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
