import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { useClassStore } from "../../stores";
import type { Grades } from "../../../mockData/types";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddClassModal({ isOpen, onClose }: AddClassModalProps) {
  const { t } = useTranslation();
  const addClass = useClassStore((state) => state.addClass);
  const classes = useClassStore((state) => state.classes);

  // Get existing grades for this teacher
  const existingGrades = classes.map((c) => c.grade);

  // Find first available grade
  const availableGrades: Grades[] = [
    "Maternelle",
    "Jardin",
    "1re année",
    "2e année",
    "3e année",
  ];
  const firstAvailableGrade: Grades =
    availableGrades.find((g) => !existingGrades.includes(g)) || "Maternelle";

  const [schoolYear, setSchoolYear] = useState("");
  const [grade, setGrade] = useState<Grades>(firstAvailableGrade);
  const [errors, setErrors] = useState({
    schoolYear: "",
    grade: "",
  });

  const handleSubmit = () => {
    const newErrors = {
      schoolYear: "",
      grade: "",
    };

    if (!schoolYear.trim()) {
      newErrors.schoolYear = t("dashboard.errors.schoolYearRequired");
    }

    if (!grade) {
      newErrors.grade = t("dashboard.errors.gradeRequired");
    }

    if (newErrors.schoolYear || newErrors.grade) {
      setErrors(newErrors);
      return;
    }

    addClass({
      grade,
      schoolYear,
      studentCount: 0,
      studentIds: [],
    });
    setSchoolYear("");
    setGrade(firstAvailableGrade);
    setErrors({ schoolYear: "", grade: "" });
    onClose();
  };

  const handleClose = () => {
    setSchoolYear("");
    setGrade(firstAvailableGrade);
    setErrors({ schoolYear: "", grade: "" });
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
              class year
            </label>
            <input
              type="text"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: errors.schoolYear ? "#ff5757" : "#38b6ff",
              }}
              placeholder={t("dashboard.classExample")}
            />
            {errors.schoolYear && (
              <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                {errors.schoolYear}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#000000" }}>
              {t("dashboard.grade")}
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as Grades)}
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: errors.grade ? "#ff5757" : "#38b6ff",
                color: "#000000",
              }}
            >
              <option
                value="Maternelle"
                disabled={existingGrades.includes("Maternelle")}
              >
                {t("dashboard.gradeOptions.maternelle")}
                {existingGrades.includes("Maternelle")
                  ? ` (${t("dashboard.gradeOptions.alreadyExists")})`
                  : ""}
              </option>
              <option
                value="Jardin"
                disabled={existingGrades.includes("Jardin")}
              >
                {t("dashboard.gradeOptions.jardin")}
                {existingGrades.includes("Jardin")
                  ? ` (${t("dashboard.gradeOptions.alreadyExists")})`
                  : ""}
              </option>
              <option
                value="1re année"
                disabled={existingGrades.includes("1re année")}
              >
                {t("dashboard.gradeOptions.1re")}
                {existingGrades.includes("1re année")
                  ? ` (${t("dashboard.gradeOptions.alreadyExists")})`
                  : ""}
              </option>
              <option
                value="2e année"
                disabled={existingGrades.includes("2e année")}
              >
                {t("dashboard.gradeOptions.2e")}
                {existingGrades.includes("2e année")
                  ? ` (${t("dashboard.gradeOptions.alreadyExists")})`
                  : ""}
              </option>
              <option
                value="3e année"
                disabled={existingGrades.includes("3e année")}
              >
                {t("dashboard.gradeOptions.3e")}
                {existingGrades.includes("3e année")
                  ? ` (${t("dashboard.gradeOptions.alreadyExists")})`
                  : ""}
              </option>
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
