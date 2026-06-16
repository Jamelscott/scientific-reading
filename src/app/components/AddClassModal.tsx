import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { useAuthStore, useClassStore } from "../../stores";
import type { Grades, TeacherUser } from "../../../types";
import { useParams } from "react-router";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSchoolYear?: number | null;
}

export function AddClassModal({
  isOpen,
  onClose,
  defaultSchoolYear,
}: AddClassModalProps) {
  const { t } = useTranslation();
  const { teacherId } = useParams();
  const addClass = useClassStore((state) => state.addClass);
  const classes = useClassStore((state) => state.classes);
  const currentUser = useAuthStore((state) => state.currentUser) as TeacherUser;

  const boardId = currentUser?.board_id;
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(
    () => Array.from({ length: 5 }, (_, index) => currentYear - 2 + index),
    [currentYear],
  );
  const resolvedDefaultYear =
    defaultSchoolYear && yearOptions.includes(defaultSchoolYear)
      ? defaultSchoolYear
      : currentYear;

  const getClassYear = (classItem: unknown): number | null => {
    const maybeYear = (classItem as { year?: unknown }).year;
    if (typeof maybeYear === "number") {
      return maybeYear;
    }

    const maybeSchoolYear = (classItem as { schoolYear?: unknown }).schoolYear;
    if (typeof maybeSchoolYear === "string") {
      const startYear = Number(maybeSchoolYear.split("-")[0]);
      if (!Number.isNaN(startYear)) {
        return startYear;
      }
    }

    return null;
  };

  const [schoolYear, setSchoolYear] = useState<number>(resolvedDefaultYear);

  // Get existing grades for this teacher in selected school year only
  const existingGradesForYear = useMemo(
    () =>
      classes
        .filter((classItem) => getClassYear(classItem) === schoolYear)
        .map((classItem) => classItem.grade),
    [classes, schoolYear],
  );

  // Find first available grade
  const availableGrades: Grades[] = [
    "Maternelle",
    "Jardin",
    "1re année",
    "2e année",
    "3e année",
  ];
  const firstAvailableGrade: Grades = useMemo(
    () =>
      availableGrades.find((g) => !existingGradesForYear.includes(g)) ||
      "Maternelle",
    [existingGradesForYear],
  );

  const [grade, setGrade] = useState<Grades>(firstAvailableGrade);
  const [errors, setErrors] = useState({
    schoolYear: "",
    grade: "",
  });

  useEffect(() => {
    setGrade(firstAvailableGrade);
  }, [firstAvailableGrade]);

  useEffect(() => {
    if (!isOpen) return;
    setSchoolYear(resolvedDefaultYear);
  }, [isOpen, resolvedDefaultYear]);

  const handleSubmit = () => {
    const newErrors = {
      schoolYear: "",
      grade: "",
    };

    if (!schoolYear || typeof schoolYear !== "number") {
      newErrors.schoolYear = t("dashboard.errors.schoolYearRequired");
      setErrors(newErrors);

      return;
    }

    if (!grade) {
      newErrors.grade = t("dashboard.errors.gradeRequired");
    }

    if (newErrors.schoolYear || newErrors.grade) {
      setErrors(newErrors);
      return;
    }
    if (!teacherId) {
      setErrors({ schoolYear: "", grade: "" });
      return;
    }

    addClass(grade, schoolYear, teacherId, boardId!, currentUser.school_id);
    setSchoolYear(resolvedDefaultYear);
    setGrade(firstAvailableGrade);
    setErrors({ schoolYear: "", grade: "" });
    onClose();
  };

  const handleClose = () => {
    setSchoolYear(resolvedDefaultYear);
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
            className="p-2 rounded-xl transition-all hover:shadow-sm active:shadow-inner"
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
            <select
              value={schoolYear}
              onChange={(e) => setSchoolYear(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: errors.schoolYear ? "#ff5757" : "#38b6ff",
                color: "#000000",
              }}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {`${year}-${year + 1}${year === currentYear ? " (current year)" : ""}`}
                </option>
              ))}
            </select>
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
                disabled={existingGradesForYear.includes("Maternelle")}
              >
                {t("dashboard.gradeOptions.maternelle")}
                {existingGradesForYear.includes("Maternelle")
                  ? ` (${t("dashboard.gradeOptions.alreadyExists")})`
                  : ""}
              </option>
              <option
                value="Jardin"
                disabled={existingGradesForYear.includes("Jardin")}
              >
                {t("dashboard.gradeOptions.jardin")}
                {existingGradesForYear.includes("Jardin")
                  ? ` (${t("dashboard.gradeOptions.alreadyExists")})`
                  : ""}
              </option>
              <option
                value="1re année"
                disabled={existingGradesForYear.includes("1re année")}
              >
                {t("dashboard.gradeOptions.1re")}
                {existingGradesForYear.includes("1re année")
                  ? ` (${t("dashboard.gradeOptions.alreadyExists")})`
                  : ""}
              </option>
              <option
                value="2e année"
                disabled={existingGradesForYear.includes("2e année")}
              >
                {t("dashboard.gradeOptions.2e")}
                {existingGradesForYear.includes("2e année")
                  ? ` (${t("dashboard.gradeOptions.alreadyExists")})`
                  : ""}
              </option>
              <option
                value="3e année"
                disabled={existingGradesForYear.includes("3e année")}
              >
                {t("dashboard.gradeOptions.3e")}
                {existingGradesForYear.includes("3e année")
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
              disabled={existingGradesForYear.length >= 5} // Max 5 grades per year
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
