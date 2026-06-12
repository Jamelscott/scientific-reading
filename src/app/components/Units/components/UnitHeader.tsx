import { ArrowLeft, History, ChevronDown, Save, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router";
import {
  useClassStore,
  useStudentStore,
  useTeacherStore,
  useUnitsStore,
  useAuthStore,
} from "../../../../stores";
import { GlobalLoadingSpinner } from "../../GlobalLoadingSpinner";
import { ConfirmationModal } from "../../ui/ConfirmationModal";

type UnitHeaderProps = {
  title: string;
  evaluationNumber: string;
  notRequired: boolean;
  setNotRequired: (value: boolean) => void;
  handleSave: () => void;
  handleNotRequired: () => void;
  isSaveDisabled?: boolean;
  setIsSaveDisabled: (val: boolean) => void;
};

export function UnitHeader({
  evaluationNumber,
  title,
  handleSave,
  handleNotRequired,
  notRequired,
  setNotRequired,
  isSaveDisabled = false,
  setIsSaveDisabled,
}: UnitHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [showNotRequiredModal, setShowNotRequiredModal] = useState(false);
  const unitsData = useUnitsStore((state) => state.unitsData);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { classId, studentId, teacherId, schoolId } = useParams<{
    classId: string;
    studentId: string;
    teacherId: string;
    schoolId?: string;
  }>();
  const classes = useClassStore((state) => state.classes);
  const teacher = useTeacherStore((state) =>
    state.getTeacherById(teacherId || ""),
  );
  const classData = useMemo(() => {
    return classes.find((c) => c.id === classId!);
  }, [classId, classes]);

  const studentData = useStudentStore((state) =>
    state.students.find((s) => s.id === studentId),
  );

  if (!classData || !studentData) return <GlobalLoadingSpinner />;
  return (
    <div
      className="p-6 border-b flex-shrink-0 z-10"
      style={{
        background: "#ffffff",
        borderColor: "#dff3ff",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
        position: "relative",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() =>
            navigate(`/teacher/${teacherId}/class/${classData.id}`)
          }
          className="flex items-center gap-2 mb-4 text-sm hover:font-bold transition-allcursor-pointer"
          style={{ color: "#38b6ff" }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t("units.backToTracking")}
        </button>

        <div className="flex items-center justify-between">
          <div>
            <div
              className="inline-block px-4 py-2 rounded-lg mb-3"
              style={{ background: "#004aad", color: "#ffffff" }}
            >
              <p className="text-sm">{t("units.measurmentSystem")}</p>
            </div>
            <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
              {t(title)}
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              <Link
                to={`/teacher/${teacherId}/class/${classData.id}/student/${studentData.id}`}
                className="text-blue-600 underline"
              >
                {studentData.name}
              </Link>
            </p>
            <p className="text-sm">{teacher?.name}</p>
            <p className="text-sm" style={{ color: "#000000", opacity: 0.7 }}>
              {classData.schoolYear}
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <button
              className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
              style={{
                background: "#ffffff",
                border: "1px solid #dff3ff",
                color: "#004aad",
              }}
            >
              <History className="w-5 h-5" />
              {t("units.history")}
            </button>

            <div className="relative">
              <select
                value={evaluationNumber}
                onChange={(e) => {
                  if (currentUser?.type === "teacher") {
                    navigate(
                      `/teacher/${teacherId}/class/${classData.id}/student/${studentId}/evaluation/${e.target.value}`,
                    );
                  } else if (currentUser?.type === "school") {
                    navigate(
                      `/school/${schoolId}/teacher/${teacherId}/class/${classData.id}/student/${studentId}/evaluation/${e.target.value}`,
                    );
                  }
                }}
                className="px-6 py-3 rounded-xl appearance-none pr-12"
                style={{
                  background: "#ffffff",
                  border: "1px solid #dff3ff",
                  color: "#004aad",
                }}
              >
                {unitsData.map((evaluation) => (
                  <option key={evaluation.id} value={evaluation.id}>
                    {t("units.evaluation", { number: evaluation.id })}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                style={{ color: "#004aad" }}
              />
            </div>

            {currentUser?.type === "teacher" && (
              <>
                <label
                  className="px-6 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all whitespace-nowrap"
                  style={{
                    background: notRequired ? "#ffde59" : "#ffffff",
                    border: `1px solid ${notRequired ? "#ffde59" : "#dff3ff"}`,
                    color: "#000000",
                  }}
                  onClick={() => setIsSaveDisabled(false)}
                >
                  <input
                    type="checkbox"
                    checked={notRequired}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setShowNotRequiredModal(true);
                      } else {
                        setNotRequired(false);
                      }
                      setIsSaveDisabled(true);
                    }}
                    className="w-5 h-5 rounded flex-shrink-0"
                    style={{ accentColor: "#004aad" }}
                  />
                  <span className="whitespace-nowrap">
                    {t("common.notRequired")}
                  </span>
                </label>
                <button
                  onClick={() => {
                    handleSave();
                  }}
                  disabled={isSaveDisabled || isLoading}
                  className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                  style={{
                    background: isSaved ? "#22c55e" : "#004aad",
                    color: "#ffffff",
                    opacity: isSaveDisabled || isLoading ? 0.5 : 1,
                    cursor:
                      isSaveDisabled || isLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-5 h-5" />
                      {t("common.saved")}
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t("common.saving", "Saving...")}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {t("common.save")}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showNotRequiredModal}
        message={t("evaluation.confirmNotRequired")}
        onConfirm={() => {
          setNotRequired(true);
          handleNotRequired();
        }}
        onCancel={() => {
          setShowNotRequiredModal(false);
        }}
      />
    </div>
  );
}

export default UnitHeader;
