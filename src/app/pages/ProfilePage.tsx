import { NotificationDropdown } from "../components/NotificationDropdown";
import { Sidebar } from "../components/Sidebar";
import { Initials } from "../components/Initials";
import { TeacherDetailsForm } from "../components/ProfilePage/TeacherDetailsForm";
import { useTranslation } from "react-i18next";
import { useStudentStore, useClassStore } from "../../stores";

export function ProfilePage() {
  const { t } = useTranslation();
  const students = useStudentStore((state) => state.students);
  const classes = useClassStore((state) => state.classes);

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
              {t("profile.title")}
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              {t("profile.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Initials size="sm" />
          </div>
        </div>

        {/* Profile Card */}
        <div className="max-w-4xl">
          <TeacherDetailsForm />

          {/* Additional Info Card */}
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
              {t("profile.teachingInfo")}
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 rounded-xl" style={{ background: "#dff3ff" }}>
                <p className="text-sm mb-2" style={{ color: "#000000" }}>
                  {t("profile.classes")}
                </p>
                <p className="text-2xl" style={{ color: "#004aad" }}>
                  {classes.length}
                </p>
              </div>
              <div className="p-6 rounded-xl" style={{ background: "#dff3ff" }}>
                <p className="text-sm mb-2" style={{ color: "#000000" }}>
                  {t("profile.students")}
                </p>
                <p className="text-2xl" style={{ color: "#004aad" }}>
                  {students.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
