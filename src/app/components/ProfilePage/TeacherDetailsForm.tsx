import { useState } from "react";
import { User, Mail, Phone, Building, Calendar, Edit } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTeacherStore } from "../../../stores";
import { Initials } from "../Initials";
import { validateForm, formatPhoneNumber, FormErrors } from "./formValidation";

export function TeacherDetailsForm() {
  const { t } = useTranslation();
  const teacher = useTeacherStore((state) => state.teacher);
  const updateTeacher = useTeacherStore((state) => state.updateTeacher);
  const [isEditing, setIsEditing] = useState(false);

  // Extract first and last name from teacher.name
  const nameParts = teacher?.name?.split(" ") || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Temporary edit state
  const [editForm, setEditForm] = useState({
    firstName: firstName,
    lastName: lastName,
    email: teacher?.email || "",
    phone: teacher?.phoneNumber || "",
    school: teacher?.school || "",
    startDate: teacher?.startDate || "",
  });

  // Validation errors
  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    school: "",
  });

  const handleSave = () => {
    const { isValid, errors: validationErrors } = validateForm(editForm, t);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    updateTeacher({
      name: `${editForm.firstName} ${editForm.lastName}`,
      email: editForm.email,
      phoneNumber: editForm.phone,
      school: editForm.school,
    });
    setIsEditing(false);
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      school: "",
    });
  };

  return (
    <div
      className="rounded-2xl p-8 shadow-lg mb-6"
      style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
    >
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-6">
          <Initials size="xl" />
          <div>
            <h2 className="text-2xl mb-1" style={{ color: "#004aad" }}>
              {firstName} {lastName}
            </h2>
            <p className="text-lg" style={{ color: "#000000" }}>
              {t("profile.teacher")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
          style={{
            background: isEditing ? "#ffffff" : "#004aad",
            color: isEditing ? "#004aad" : "#ffffff",
            border: isEditing ? "1px solid #004aad" : "none",
          }}
        >
          <Edit className="w-5 h-5" />
          {isEditing ? t("profile.cancelEdit") : t("profile.edit")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5" style={{ color: "#38b6ff" }} />
              <label className="text-sm" style={{ color: "#000000" }}>
                {t("profile.firstName")}
              </label>
            </div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{
                    background: "#dff3ff",
                    borderColor: errors.firstName ? "#ff5757" : "#38b6ff",
                  }}
                />
                {errors.firstName && (
                  <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                    {errors.firstName}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg px-4 py-3" style={{ color: "#000000" }}>
                {firstName}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5" style={{ color: "#38b6ff" }} />
              <label className="text-sm" style={{ color: "#000000" }}>
                {t("profile.email")}
              </label>
            </div>
            {isEditing ? (
              <>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{
                    background: "#dff3ff",
                    borderColor: errors.email ? "#ff5757" : "#38b6ff",
                  }}
                />
                {errors.email && (
                  <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                    {errors.email}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg px-4 py-3" style={{ color: "#000000" }}>
                {teacher?.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-5 h-5" style={{ color: "#38b6ff" }} />
              <label className="text-sm" style={{ color: "#000000" }}>
                {t("profile.school")}
              </label>
            </div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editForm.school}
                  onChange={(e) =>
                    setEditForm({ ...editForm, school: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{
                    background: "#dff3ff",
                    borderColor: errors.school ? "#ff5757" : "#38b6ff",
                  }}
                />
                {errors.school && (
                  <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                    {errors.school}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg px-4 py-3" style={{ color: "#000000" }}>
                {teacher?.school}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5" style={{ color: "#38b6ff" }} />
              <label className="text-sm" style={{ color: "#000000" }}>
                {t("profile.lastName")}
              </label>
            </div>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{
                    background: "#dff3ff",
                    borderColor: errors.lastName ? "#ff5757" : "#38b6ff",
                  }}
                />
                {errors.lastName && (
                  <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                    {errors.lastName}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg px-4 py-3" style={{ color: "#000000" }}>
                {lastName}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5" style={{ color: "#38b6ff" }} />
              <label className="text-sm" style={{ color: "#000000" }}>
                {t("profile.phone")}
              </label>
            </div>
            {isEditing ? (
              <>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  placeholder="1234567890"
                  className="w-full px-4 py-3 rounded-xl border"
                  style={{
                    background: "#dff3ff",
                    borderColor: errors.phone ? "#ff5757" : "#38b6ff",
                  }}
                />
                {errors.phone && (
                  <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                    {errors.phone}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg px-4 py-3" style={{ color: "#000000" }}>
                {formatPhoneNumber(editForm.phone)}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5" style={{ color: "#38b6ff" }} />
              <label className="text-sm" style={{ color: "#000000" }}>
                {t("profile.startDate")}
              </label>
            </div>
            <p className="text-lg px-4 py-3" style={{ color: "#000000" }}>
              {editForm.startDate}
            </p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div
          className="flex justify-end gap-4 mt-8 pt-8 border-t"
          style={{ borderColor: "#dff3ff" }}
        >
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-3 rounded-xl transition-all"
            style={{
              background: "#ffffff",
              border: "1px solid #dff3ff",
              color: "#000000",
            }}
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl transition-all"
            style={{
              background: "#004aad",
              color: "#ffffff",
            }}
          >
            {t("profile.save")}
          </button>
        </div>
      )}
    </div>
  );
}
