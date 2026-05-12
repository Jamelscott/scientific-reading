import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Download, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useClassStore } from "../../../stores/useClassStore";
import { useStudentStore } from "../../../stores/useStudentStore";
import { useUnitsStore } from "../../../stores/useUnitsStore";
import { useTeacherStore } from "../../../stores/useTeacherStore";
import { AddStudentModal } from "../../components/AddStudentModal";
import { ClassTable } from "../../components/TeacherClassPage/ClassTable";
import { exportTableToPdf } from "../../components/utils/exportToPdf";
import { Button } from "../../components/ui/Button";

export function ClassPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const classes = useClassStore((state) => state.classes);
  const updateClass = useClassStore((state) => state.updateClass);
  const teacher = useTeacherStore((state) => state.teacher);

  // Parse classId from URL and set it as active
  const currentClassId = parseInt(classId || "", 10);
  const currentClass = classes.find((c) => c?.id === currentClassId);

  const allStudents = useStudentStore((state) => state.students);
  const students = allStudents.filter((student) =>
    student.classIds.includes(currentClassId),
  );
  const answers = useUnitsStore((state) => state.getAnswersByClass);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [isEditingClassName, setIsEditingClassName] = useState(false);
  const [editedClassName, setEditedClassName] = useState("");

  const handleClassNameClick = () => {
    setEditedClassName(currentClass?.name || "");
    setIsEditingClassName(true);
  };

  const handleClassNameSave = () => {
    if (editedClassName.trim() && currentClassId) {
      updateClass(currentClassId, { name: editedClassName.trim() });
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

  const handleExportPDF = async () => {
    if (!currentClass?.name) return;
    const teacherName = teacher?.name || "Teacher";
    await exportTableToPdf(currentClass.name, teacherName);
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
            onClick={() => navigate("/teacher/dashboard")}
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
                  {currentClass?.name || "1re année Mme Gisèle"}
                </h1>
              )}
              <p className="text-lg" style={{ color: "#000000" }}>
                {t("studentTracking.studentsCount", {
                  count: currentClass?.studentCount || students.length,
                })}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddStudentModal(true)}
                label="studentTracking.addStudent"
                leadingIcon={<Plus className="w-5 h-5" />}
                className="bg-[#38b6ff] text-white"
              />
              <Button
                onClick={handleExportPDF}
                label="studentTracking.exportPdf"
                leadingIcon={<Download className="w-5 h-5" />}
                variant="secondary"
                className="text-[#004aad] border-[#dff3ff]"
              />
            </div>
          </div>
        </div>
      </div>

      <ClassTable
        students={students}
        classAnswers={answers(currentClassId)}
        classId={String(currentClassId)}
      />

      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        classId={currentClassId}
      />
    </div>
  );
}
