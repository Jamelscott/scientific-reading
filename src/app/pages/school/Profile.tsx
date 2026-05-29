import { useState } from "react";
import { User, Mail, UserPlus, Users as UsersIcon, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sidebar } from "../../components/Sidebar";
import { Initials } from "../../components/Initials";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { AddTeacherModal } from "../../components/AddTeacherModal";
import { DeleteTeacherModal } from "../../components/DeleteTeacherModal";
import { useAuthStore, useTeacherStore, useStudentStore, useClassStore } from "../../../stores";

export function SchoolProfile() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const teachers = useTeacherStore((state) => state.teachers);
  const removeTeacher = useTeacherStore((state) => state.removeTeacher);
  const students = useStudentStore((state) => state.students);
  const classes = useClassStore((state) => state.classes);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<{ id: string; name: string } | null>(null);

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      <Sidebar />
      <div className="flex-1 p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
              {t("school.profileTitle")}
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              {t("school.profileSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Initials size="sm" />
          </div>
        </div>

        <div className="max-w-5xl space-y-6">
          {/* School Info Card */}
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center gap-6 mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{ background: "#004aad", color: "#ffffff" }}
              >
                {currentUser?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .filter((_, i, a) => i === 0 || i === a.length - 1)
                  .join("")
                  .toUpperCase() || "ÉL"}
              </div>
              <div>
                <h2 className="text-2xl mb-1" style={{ color: "#004aad" }}>
                  {currentUser?.name || "École Laurier-Trudeau"}
                </h2>
                <p className="text-lg" style={{ color: "#000000" }}>
                  {t("school.schoolAdmin")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5" style={{ color: "#38b6ff" }} />
                  <label className="text-sm" style={{ color: "#000000" }}>
                    {t("profile.email")}
                  </label>
                </div>
                <p className="text-lg px-4 py-3" style={{ color: "#000000" }}>
                  {currentUser?.email || "contact@laurier-trudeau.edu"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5" style={{ color: "#38b6ff" }} />
                  <label className="text-sm" style={{ color: "#000000" }}>
                    ID
                  </label>
                </div>
                <p className="text-lg px-4 py-3" style={{ color: "#000000" }}>
                  {currentUser?.id || "SCH-001"}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <h2 className="text-xl mb-6" style={{ color: "#004aad" }}>
              {t("school.schoolInfo")}
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 rounded-xl" style={{ background: "#dff3ff" }}>
                <p className="text-sm mb-2" style={{ color: "#000000" }}>
                  {t("school.teachersCount")}
                </p>
                <p className="text-2xl" style={{ color: "#004aad" }}>
                  {teachers?.length || 0}
                </p>
              </div>
              <div className="p-6 rounded-xl" style={{ background: "#dff3ff" }}>
                <p className="text-sm mb-2" style={{ color: "#000000" }}>
                  {t("common.classes")}
                </p>
                <p className="text-2xl" style={{ color: "#004aad" }}>
                  {classes?.length || 0}
                </p>
              </div>
              <div className="p-6 rounded-xl" style={{ background: "#dff3ff" }}>
                <p className="text-sm mb-2" style={{ color: "#000000" }}>
                  {t("school.students")}
                </p>
                <p className="text-2xl" style={{ color: "#004aad" }}>
                  {students?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Teachers List Card */}
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ color: "#004aad" }}>
                {t("school.teachers")} ({teachers?.length || 0})
              </h2>
              <button
                onClick={() => setIsAddTeacherModalOpen(true)}
                className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                style={{
                  background: "#004aad",
                  color: "#ffffff",
                }}
              >
                <UserPlus className="w-5 h-5" />
                {t("school.addTeacher")}
              </button>
            </div>

            {!teachers || teachers.length === 0 ? (
              <div
                className="p-12 text-center rounded-xl"
                style={{ background: "#f9fafb" }}
              >
                <UsersIcon
                  className="w-12 h-12 mx-auto mb-3 opacity-30"
                  style={{ color: "#004aad" }}
                />
                <p className="font-semibold mb-1" style={{ color: "#004aad" }}>
                  {t("school.noTeachers")}
                </p>
                <p className="text-sm" style={{ color: "#666" }}>
                  {t("school.addFirstTeacher")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {teachers.map((teacher) => {
                  const initials = teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .filter((_, i, a) => i === 0 || i === a.length - 1)
                    .join("")
                    .toUpperCase();

                  return (
                    <div
                      key={teacher.id}
                      className="p-5 rounded-xl flex items-center justify-between hover:shadow-md transition-all"
                      style={{ background: "#dff3ff" }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ background: "#004aad", color: "#ffffff" }}
                        >
                          {initials}
                        </div>
                        <div>
                          <p
                            className="font-semibold text-base mb-1"
                            style={{ color: "#004aad" }}
                          >
                            {teacher.name}
                          </p>
                          <p className="text-sm" style={{ color: "#666" }}>
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {teacher.subjects && teacher.subjects.length > 0 && (
                          <div className="text-right">
                            <p className="text-xs mb-1" style={{ color: "#888" }}>
                              {t("school.subjects")}
                            </p>
                            <p className="text-sm" style={{ color: "#004aad" }}>
                              {teacher.subjects.join(", ")}
                            </p>
                          </div>
                        )}
                        {teacher.phoneNumber && (
                          <div className="text-right">
                            <p className="text-xs mb-1" style={{ color: "#888" }}>
                              {t("profile.phone")}
                            </p>
                            <p className="text-sm" style={{ color: "#004aad" }}>
                              {teacher.phoneNumber}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={() => setTeacherToDelete({ id: teacher.id, name: teacher.name })}
                          className="p-2 rounded-lg transition-all hover:bg-red-50"
                          style={{ color: "#ff5757" }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddTeacherModal
        isOpen={isAddTeacherModalOpen}
        onClose={() => setIsAddTeacherModalOpen(false)}
      />

      <DeleteTeacherModal
        isOpen={!!teacherToDelete}
        teacherName={teacherToDelete?.name || ""}
        onConfirm={() => {
          if (teacherToDelete) {
            removeTeacher(teacherToDelete.id);
            setTeacherToDelete(null);
          }
        }}
        onCancel={() => setTeacherToDelete(null)}
      />
    </div>
  );
}
