import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Download, Plus, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useClassStore } from "../../../stores/useClassStore";
import { useStudentStore } from "../../../stores/useStudentStore";
import { useTeacherStore } from "../../../stores/useTeacherStore";
import { AddStudentModal } from "../../components/AddStudentModal";
import { ClassTable } from "../../components/TeacherClassPage/ClassTable";
import { exportTableToPdf } from "../../components/utils/exportToPdf";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../../stores";

export function ClassPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { classId, teacherId, schoolId } = useParams<{
    classId: string;
    teacherId: string;
    schoolId?: string;
  }>();
  const classes = useClassStore((state) => state.classes);
  const teacher = useTeacherStore((state) => state.teacher);
  const currentUser = useAuthStore((state) => state.currentUser);
  const boardId =
    currentUser?.type === "board" || currentUser?.type === "admin"
      ? currentUser.id
      : currentUser?.board_id;

  const currentClass = useClassStore.getState().getClassById(classId!);
  const getStudentCountByClass = useStudentStore(
    (state) => state.getStudentCountByClass,
  );

  const allStudents = useStudentStore((state) => state.students);
  const students = useMemo(() => {
    return allStudents.filter((student) => student.class_id === classId);
  }, [allStudents, classId]);

  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowClassDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClassChange = (classId: string) => {
    setShowClassDropdown(false);
    if (schoolId) {
      navigate(`/school/${schoolId}/teacher/${teacherId}/class/${classId}`);
    } else {
      navigate(`/teacher/${teacherId}/class/${classId}`);
    }
  };

  const handleExportPDF = async () => {
    if (!currentClass?.grade) return;
    const teacherName = teacher?.name || "Teacher";
    await exportTableToPdf(currentClass.grade, teacherName);
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      {/* Header */}
      <div
        className="p-6 border-b flex-shrink-0 shadow-sm z-11"
        style={{
          background: "#ffffff",
          borderColor: "#dff3ff",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() =>
              navigate(
                schoolId
                  ? `/school/${schoolId}/dashboard`
                  : `/teacher/${teacherId}/dashboard`,
              )
            }
            className="flex items-center gap-2 mb-4 text-sm text-[#38b6ff] hover:font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {t(
              schoolId
                ? "studentTracking.backToDashboard"
                : "studentTracking.backToDashboard",
            )}
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowClassDropdown(!showClassDropdown)}
                  className="flex items-center gap-2 text-3xl mb-2 hover:opacity-80 hover:font-bold transition-all cursor-pointer"
                  style={{ color: "#004aad" }}
                >
                  {currentClass?.grade || "no class available"}
                  <ChevronDown
                    className="w-6 h-6 transition-transform duration-200"
                    style={{
                      transform: showClassDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                {showClassDropdown && (
                  <div
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border overflow-hidden z-50 min-w-[250px] w-max"
                    style={{ borderColor: "#dff3ff" }}
                  >
                    {classes.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => handleClassChange(cls.id)}
                        className="w-full px-4 py-3 text-left transition-all flex items-center justify-between group hover:bg-[#38b6ff] hover:scale-[1.02] hover:shadow-md cursor-pointer"
                        style={{
                          backgroundColor:
                            cls.id === classId ? "#dff3ff" : "transparent",
                        }}
                      >
                        <div className="flex flex-col gap-1">
                          <span
                            className="group-hover:text-white transition-colors"
                            style={{ color: "#004aad" }}
                          >
                            {cls.grade}
                          </span>
                          {schoolId && (
                            <span
                              className="text-xs group-hover:text-white/90 transition-colors"
                              style={{ color: "#666" }}
                            >
                              {teacher?.name || "Unknown Teacher"}
                            </span>
                          )}
                        </div>
                        <span
                          className="text-sm group-hover:text-white transition-colors whitespace-nowrap"
                          style={{ color: "#666" }}
                        >
                          {t("studentTracking.studentsCount", {
                            count: getStudentCountByClass(cls.id),
                          })}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {schoolId && currentClass && (
                <p className="text-sm mb-1" style={{ color: "#666" }}>
                  {teacher?.name || "Unknown Teacher"}
                </p>
              )}
              <p className="text-lg" style={{ color: "#000000" }}>
                {t("studentTracking.studentsCount", {
                  count: students.length,
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

      <ClassTable students={students} classId={classId!} />

      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        classId={classId!}
        schoolId={schoolId!}
        teacherId={teacherId!}
        boardId={boardId!}
      />
    </div>
  );
}
