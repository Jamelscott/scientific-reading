import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { useStudentStore } from "../../stores/useStudentStore";
import { useSchoolStore } from "../../stores/useSchoolStore";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId?: number;
}

export function AddStudentModal({
  isOpen,
  onClose,
  classId,
}: AddStudentModalProps) {
  const { t } = useTranslation();
  const addStudent = useStudentStore((state) => state.addStudent);
  const activeSchoolId = useSchoolStore((state) => state.activeSchoolId);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
  });

  const handleSubmit = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
    };

    if (!firstName.trim()) {
      newErrors.firstName = t("studentTracking.errors.firstNameRequired");
    }

    if (!lastName.trim()) {
      newErrors.lastName = t("studentTracking.errors.lastNameRequired");
    }

    if (newErrors.firstName || newErrors.lastName) {
      setErrors(newErrors);
      return;
    }

    addStudent(
      firstName.trim(),
      lastName.trim(),
      classId ? [classId] : [],
      activeSchoolId,
    );
    setFirstName("");
    setLastName("");
    setErrors({ firstName: "", lastName: "" });
    onClose();
  };

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setErrors({ firstName: "", lastName: "" });
    onClose();
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
        style={{ background: "#ffffff", border: "2px solid #cccccc" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ color: "#004aad" }}>
            {t("studentTracking.addStudent")}
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
              {t("studentTracking.studentFirstName")}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: errors.firstName ? "#ff5757" : "#38b6ff",
              }}
              placeholder={t("studentTracking.firstNamePlaceholder")}
            />
            {errors.firstName && (
              <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#000000" }}>
              {t("studentTracking.studentLastName")}
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: errors.lastName ? "#ff5757" : "#38b6ff",
              }}
              placeholder={t("studentTracking.lastNamePlaceholder")}
            />
            {errors.lastName && (
              <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                {errors.lastName}
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
              label="studentTracking.addStudentButton"
              variant="primary"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
