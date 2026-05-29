import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  BookOpen,
  Edit,
  Trash2,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useClassStore } from "../../../stores";
import { useStudentStore } from "../../../stores/useStudentStore";
import { Sidebar } from "../../components/Sidebar";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Initials } from "../../components/Initials";
import { Button } from "../../components/ui/Button";
import { AddClassModal } from "../../components/AddClassModal";
import { EditClassesModal } from "../../components/EditClassesModal";

export function TeacherDashboard() {
  const { t } = useTranslation();
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const classes = useClassStore((state) => state.classes);
  const setClasses = useClassStore((state) => state.setClasses);
  const students = useStudentStore((state) => state.students);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditClassesModal, setShowEditClassesModal] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const handleClearCache = () => {
    if (window.confirm(t("dashboard.confirmClearCache"))) {
      // Clear localStorage
      localStorage.clear();
      // Reload the page to reset all stores
      window.location.reload();
    }
  };

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
              {t("dashboard.welcome")}
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              {t("dashboard.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Initials size="sm" />
          </div>
        </div>

        {/* Class Card */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl" style={{ color: "#004aad" }}>
              {t("dashboard.myClass")}
            </h2>
            <div className="flex gap-3">
              <Button
                onClick={() => setEditMode((v) => !v)}
                label={editMode ? "common.close" : "dashboard.editClasses"}
                leadingIcon={<Edit className="w-5 h-5" />}
                variant={editMode ? "primary" : "secondary"}
              />
              <Button
                onClick={() => setShowAddClassModal(true)}
                label="dashboard.addClass"
                leadingIcon={<Plus className="w-5 h-5" />}
                variant="primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => {
              const numOfStudents = useStudentStore((state) =>
                state.getStudentCountByClass(classItem.id),
              );
              console.log(numOfStudents);
              return (
                <div
                  key={classItem.id}
                  className="rounded-2xl p-8 shadow-lg flex flex-col justify-between"
                  style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
                >
                  <div className="flex-1 flex items-start justify-between mb-6 gap-2">
                    <div className="overflow-hidden">
                      <div
                        className={`flex items-center gap-2 text-2xl mb-2`}
                        style={{ color: "#004aad" }}
                      >
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {classItem.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ">
                        <Users
                          className="w-5 h-5"
                          style={{ color: "#38b6ff" }}
                        />
                        <span className="text-lg" style={{ color: "#000000" }}>
                          {t("dashboard.studentsCount", {
                            count: numOfStudents,
                          })}
                        </span>
                      </div>
                    </div>
                    <div
                      className="min-w-16 min-h-16 rounded-xl flex items-center justify-center"
                      style={{ background: "#dff3ff" }}
                    >
                      <BookOpen
                        className="w-8 h-8"
                        style={{ color: "#004aad" }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/teacher/${teacherId}/class/${classItem.id}`)
                      }
                      className="w-full py-3 rounded-xl transition-all"
                      style={{ background: "#004aad", color: "#ffffff" }}
                    >
                      {t("dashboard.viewMyClass")}
                    </button>
                    {editMode && (
                      <button
                        onClick={() => setShowDeleteId(classItem.id)}
                        className="px-4 py-3 rounded-xl flex items-center gap-2 transition-all bg-[#ff5757] text-white"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {showDeleteId === classItem.id && (
                    <div
                      className="fixed inset-0 flex items-center justify-center z-50"
                      style={{
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center">
                        <span
                          className="mb-4 text-lg"
                          style={{ color: "#ff5757" }}
                        >
                          {t("common.confirmDelete")}
                        </span>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => {
                              setClasses(teacherId!);
                              setShowDeleteId(null);
                            }}
                            label="common.confirm"
                            variant="primary"
                          />
                          <Button
                            onClick={() => setShowDeleteId(null)}
                            label="common.cancel"
                            variant="secondary"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Clear Cache Button */}
          <div className="mt-12 flex justify-center">
            <Button
              onClick={handleClearCache}
              label="dashboard.clearCache"
              leadingIcon={<RotateCcw className="w-5 h-5" />}
              variant="secondary"
            />
          </div>
        </div>
      </div>
      <AddClassModal
        isOpen={showAddClassModal}
        onClose={() => setShowAddClassModal(false)}
      />
      <EditClassesModal
        isOpen={showEditClassesModal}
        onClose={() => setShowEditClassesModal(false)}
      />
    </div>
  );
}
