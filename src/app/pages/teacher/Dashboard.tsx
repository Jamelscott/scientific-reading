import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Plus,
  BookOpen,
  Edit,
  Trash2,
  ChevronDown,
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
  const removeClass = useClassStore((state) => state.removeClass);
  const getStudentCountByClass = useStudentStore(
    (state) => state.getStudentCountByClass,
  );
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showEditClassesModal, setShowEditClassesModal] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

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

  const availableYears = useMemo(() => {
    const years = Array.from(
      new Set(
        classes
          .map((classItem) => getClassYear(classItem))
          .filter((year): year is number => year !== null),
      ),
    );
    return years.sort((a, b) => b - a);
  }, [classes]);

  useEffect(() => {
    if (availableYears.length === 0) {
      setSelectedYear(null);
      return;
    }

    setSelectedYear((currentYear) => {
      if (currentYear !== null && availableYears.includes(currentYear)) {
        return currentYear;
      }
      return availableYears[0];
    });
  }, [availableYears]);

  const filteredClasses = useMemo(() => {
    if (selectedYear === null) {
      return classes;
    }
    return classes.filter(
      (classItem) => getClassYear(classItem) === selectedYear,
    );
  }, [classes, selectedYear]);

  const formatSchoolYear = (year: number) => `${year}-${year + 1}`;

  const handleClearCache = () => {
    if (window.confirm(t("dashboard.confirmClearCache"))) {
      // Clear localStorage
      localStorage.clear();
      // Reload the page to reset all stores
      window.location.reload();
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
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
              <div className="relative">
                <select
                  value={selectedYear ?? ""}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl appearance-none pr-9 text-sm transition-shadow duration-200 hover:shadow-md"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dff3ff",
                    color: "#004aad",
                  }}
                  aria-label={t("schoolBoard.dashboard.schoolYear")}
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {formatSchoolYear(year)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "#004aad" }}
                />
              </div>
              {/* <NotificationDropdown />
              <Initials size="sm" /> */}
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
              {filteredClasses.map((classItem, index) => {
                const numOfStudents = getStudentCountByClass(classItem.id);
                return (
                  <div
                    key={classItem.id}
                    className="rounded-2xl p-8 shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #dff3ff",
                      animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`,
                    }}
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
                          <span
                            className="text-lg"
                            style={{ color: "#000000" }}
                          >
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
                          navigate(
                            `/teacher/${teacherId}/class/${classItem.id}`,
                          )
                        }
                        className="w-full py-3 rounded-xl transition-all cursor-pointer"
                        style={{ background: "#004aad", color: "#ffffff" }}
                      >
                        {t("dashboard.viewMyClass")}
                      </button>
                      {editMode && (
                        <button
                          onClick={() => setShowDeleteId(classItem.id)}
                          className="px-4 py-3 rounded-xl flex items-center gap-2 transition-all bg-[#ff5757] text-white cursor-pointer"
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
                              onClick={async () => {
                                await removeClass(classItem.id);
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
            {/* <div className="mt-12 flex justify-center">
              <Button
                onClick={handleClearCache}
                label="dashboard.clearCache"
                leadingIcon={<RotateCcw className="w-5 h-5" />}
                variant="secondary"
              />
            </div> */}
          </div>
        </div>
        <AddClassModal
          isOpen={showAddClassModal}
          defaultSchoolYear={selectedYear}
          onClose={() => setShowAddClassModal(false)}
        />
        <EditClassesModal
          isOpen={showEditClassesModal}
          onClose={() => setShowEditClassesModal(false)}
        />
      </div>
    </>
  );
}
