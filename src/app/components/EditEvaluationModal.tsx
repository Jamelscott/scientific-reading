import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { CloseButton } from "./ui/CloseButton";
import {
  useEvaluationsStore,
  useClassStore,
  useStudentStore,
} from "../../stores";

interface EditEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  studentName: string;
  classId: number;
  currentEvaluations: ("success" | "adequate" | "needs-improvement" | null)[];
}

export function EditEvaluationModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  classId,
  currentEvaluations,
}: EditEvaluationModalProps) {
  const { t } = useTranslation();
  const updateEvaluation = useEvaluationsStore(
    (state) => state.updateEvaluation,
  );
  const removeEvaluationsByStudentAndClass = useEvaluationsStore(
    (state) => state.removeEvaluationsByStudentAndClass,
  );
  const removeStudentFromClass = useClassStore(
    (state) => state.removeStudentFromClass,
  );
  const removeClassFromStudent = useStudentStore(
    (state) => state.removeClassFromStudent,
  );
  const [evaluations, setEvaluations] = useState<
    ("success" | "adequate" | "needs-improvement" | null)[]
  >([...currentEvaluations, ...Array(11)].slice(0, 11).map((v) => v ?? null));
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEvaluations(
        [...currentEvaluations, ...Array(11)]
          .slice(0, 11)
          .map((v) => v ?? null),
      );
    } else {
      setEvaluations([]);
    }
  }, [isOpen, currentEvaluations]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update each evaluation in the store
    evaluations.forEach((status, index) => {
      updateEvaluation(studentId, classId, index, status);
    });
    onClose();
  };

  const handleRemoveStudent = () => {
    // Remove student from class
    removeStudentFromClass(classId, studentId);
    // Remove class from student
    removeClassFromStudent(studentId, classId);
    // Remove evaluations for this student in this class
    removeEvaluationsByStudentAndClass(studentId, classId);
    onClose();
  };

  const handleEvaluationClick = (
    index: number,
    status: "success" | "adequate" | "needs-improvement" | null,
  ) => {
    const newEvaluations = [...evaluations];
    newEvaluations[index] = newEvaluations[index] === status ? null : status;
    setEvaluations(newEvaluations);
  };

  const getStatusColor = (
    status: "success" | "adequate" | "needs-improvement" | null,
  ) => {
    if (status === "success") return "#c9e265";
    if (status === "adequate") return "#ffde59";
    if (status === "needs-improvement") return "#ff5757";
    return "#f8ffdb";
  };

  const getStatusText = (
    status: "success" | "adequate" | "needs-improvement" | null,
  ) => {
    if (status === "success") return "✓";
    if (status === "adequate") return "~";
    if (status === "needs-improvement") return "!";
    return "";
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl"
        style={{
          background: "#ffffff",
          border: "2px solid #cccccc",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ color: "#004aad" }}>
            {t("studentTracking.editEvaluations")} - {studentName}
          </h2>
          <CloseButton onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="grid grid-cols-6 gap-4">
              {evaluations.map((status, index) => {
                const getLabel = (idx: number) => {
                  if (idx === 0) return "1A";
                  if (idx === 1) return "1B";
                  return `${idx}`;
                };

                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <label className="text-sm" style={{ color: "#000000" }}>
                      {t("studentTracking.evaluation")} {getLabel(index)}
                    </label>
                    <div className="flex flex-col gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleEvaluationClick(index, "success")}
                        className="w-full h-12 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                        style={{
                          background:
                            status === "success" ? "#c9e265" : "#f8ffdb",
                          border:
                            status === "success"
                              ? "2px solid #004aad"
                              : "1px solid #ddd",
                          color: "#000000",
                        }}
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEvaluationClick(index, "adequate")}
                        className="w-full h-12 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                        style={{
                          background:
                            status === "adequate" ? "#ffde59" : "#f8ffdb",
                          border:
                            status === "adequate"
                              ? "2px solid #004aad"
                              : "1px solid #ddd",
                          color: status === "adequate" ? "#ffffff" : "#000000",
                        }}
                      >
                        ~
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleEvaluationClick(index, "needs-improvement")
                        }
                        className="w-full h-12 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                        style={{
                          background:
                            status === "needs-improvement"
                              ? "#ff5757"
                              : "#f8ffdb",
                          border:
                            status === "needs-improvement"
                              ? "2px solid #004aad"
                              : "1px solid #ddd",
                          color:
                            status === "needs-improvement"
                              ? "#ffffff"
                              : "#000000",
                        }}
                      >
                        !
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEvaluations((prev) => {
                            const newEvals = [...prev];
                            newEvals[index] = null;
                            return newEvals;
                          })
                        }
                        className="w-full h-10 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                        style={{
                          background: status === null ? "#e0e0e0" : "#ffffff",
                          border:
                            status === null
                              ? "2px solid #004aad"
                              : "1px solid #ddd",
                          color: "#666666",
                          fontSize: "0.75rem",
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              {showConfirmDelete ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: "#ff5757" }}>
                    {t("common.confirmDelete") || "Are you sure?"}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveStudent}
                    className="px-4 py-2 rounded-lg text-white transition-all"
                    style={{ background: "#ff5757" }}
                  >
                    {t("common.confirm") || "Confirm"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-4 py-2 rounded-lg transition-all"
                    style={{
                      background: "#f0f0f0",
                      color: "#666666",
                    }}
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:opacity-80"
                  style={{ background: "#ff5757", color: "#ffffff" }}
                >
                  <Trash2 className="w-4 h-4" />
                  {t("common.removeStudent") || "Remove Student"}
                </button>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                onClick={onClose}
                label="common.cancel"
                variant="secondary"
              />
              <Button type="submit" label="common.save" variant="primary" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
