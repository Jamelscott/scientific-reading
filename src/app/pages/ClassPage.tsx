import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, FileText, Download, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useClassStore,
  useEvaluationsStore,
  useStudentStore,
} from "../../stores";
import { AddStudentModal } from "../components/AddStudentModal";
import { EditEvaluationModal } from "../components/EditEvaluationModal";
import { EvaluationLegend } from "../components/EvaluationLegend";
import { Button } from "../components/ui/Button";
import { ClassTable } from "../components/ClassPage/ClassTable";

export function ClassPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const classes = useClassStore((state) => state.classes);
  const setActiveClass = useClassStore((state) => state.setActiveClass);
  const updateClass = useClassStore((state) => state.updateClass);

  // Parse classId from URL and set it as active
  const activeClassId = classId ? parseInt(classId, 10) : 1;

  // Update store when URL param changes
  useEffect(() => {
    if (activeClassId) {
      setActiveClass(activeClassId);
    }
  }, [activeClassId, setActiveClass]);

  const activeClass = classes.find((c) => c.id === activeClassId);

  const allStudents = useStudentStore((state) => state.students);
  const students = allStudents.filter((student) =>
    student.classIds.includes(activeClassId),
  );
  const allEvaluations = useEvaluationsStore((state) => state.evaluations);
  const evaluations = allEvaluations.filter((e) => e.classId === activeClassId);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditEvaluationModal, setShowEditEvaluationModal] = useState(false);
  const [isEditingClassName, setIsEditingClassName] = useState(false);
  const [editedClassName, setEditedClassName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedEvaluations, setSelectedEvaluations] = useState<
    ("success" | "adequate" | "needs-improvement" | null)[]
  >([]);

  const handleOpenEditModal = (
    studentId: number,
    studentName: string,
    evals: ("success" | "adequate" | "needs-improvement" | null)[],
  ) => {
    setSelectedStudent({ id: studentId, name: studentName });
    setSelectedEvaluations(evals);
    setShowEditEvaluationModal(true);
  };

  const handleClassNameClick = () => {
    setEditedClassName(activeClass?.name || "");
    setIsEditingClassName(true);
  };

  const handleClassNameSave = () => {
    if (editedClassName.trim() && activeClassId) {
      updateClass(activeClassId, { name: editedClassName.trim() });
    }
    setIsEditingClassName(false);
  };

  const handleClassNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClassNameSave();
    } else if (e.key === "Escape") {
      setIsEditingClassName(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      {/* Header */}
      <div
        className="p-6 border-b flex-shrink-0 shadow-sm z-11"
        style={{ background: "#ffffff", borderColor: "#dff3ff" }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 mb-4 text-sm text-[#38b6ff] hover:text-[#2D92CC] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("studentTracking.backToDashboard")}
          </button>

          <div className="flex items-center justify-between">
            <div>
              {isEditingClassName ? (
                <input
                  type="text"
                  value={editedClassName}
                  onChange={(e) => setEditedClassName(e.target.value)}
                  onBlur={handleClassNameSave}
                  onKeyDown={handleClassNameKeyDown}
                  autoFocus
                  className="text-3xl mb-2 px-2 py-1 rounded-lg border-2 outline-none"
                  style={{
                    color: "#004aad",
                    borderColor: "#38b6ff",
                    background: "#dff3ff",
                  }}
                />
              ) : (
                <h1
                  onClick={handleClassNameClick}
                  className="text-3xl mb-2 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: "#004aad" }}
                >
                  {activeClass?.name || "1re année Mme Gisèle"}
                </h1>
              )}
              <p className="text-lg" style={{ color: "#000000" }}>
                {t("studentTracking.studentsCount", {
                  count: activeClass?.studentCount || students.length,
                })}
              </p>
              <EvaluationLegend />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddStudentModal(true)}
                label="studentTracking.addStudent"
                leadingIcon={<Plus className="w-5 h-5" />}
                className="bg-[#38b6ff] text-white"
              />
              <Button
                onClick={() => {
                  /* TODO: wire enter results action */
                }}
                label="studentTracking.enterResults"
                leadingIcon={<FileText className="w-5 h-5" />}
                variant="primary"
              />
              <Button
                onClick={() => {
                  /* TODO: wire export PDF action */
                }}
                label="studentTracking.exportPdf"
                leadingIcon={<Download className="w-5 h-5" />}
                variant="secondary"
                className="text-[#004aad] border-[#dff3ff]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <ClassTable
        students={students}
        evaluations={evaluations}
        onStudentClick={handleOpenEditModal}
      />

      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        classId={activeClassId}
      />

      {selectedStudent && (
        <EditEvaluationModal
          isOpen={showEditEvaluationModal}
          onClose={() => setShowEditEvaluationModal(false)}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          classId={activeClassId}
          currentEvaluations={selectedEvaluations}
        />
      )}
    </div>
  );
}
