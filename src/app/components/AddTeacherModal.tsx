import { useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { useTeacherStore } from "../../stores/useTeacherStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { Teacher } from "../../../mockData/types";
import {
  formatPhoneNumber,
  formatPhoneInput,
} from "./ProfilePage/formValidation";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTeacherModal({ isOpen, onClose }: AddTeacherModalProps) {
  const { t } = useTranslation();
  // const addTeacher = useTeacherStore((state) => state.updateTeachers);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    subjects: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const handleSubmit = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("profile.errors.firstNameRequired");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t("profile.errors.lastNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("profile.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("profile.errors.emailInvalid");
    }

    if (
      formData.phoneNumber &&
      !/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))
    ) {
      newErrors.phoneNumber = t("profile.errors.phoneInvalid");
    }

    if (Object.values(newErrors).some((error) => error !== "")) {
      setErrors(newErrors);
      return;
    }

    // Get school info from current user
    const schoolId = currentUser?.type === "school" ? currentUser.id : "";
    const boardId = currentUser?.type === "school" ? currentUser.board_id : "";

    const newTeacher: Partial<Teacher> = {
      type: "teacher",
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email.trim(),
      phone_number: formData.phoneNumber.trim() || undefined,
      school_id: schoolId,
      board_id: boardId,
      subjects: formData.subjects
        ? formData.subjects.split(",").map((s) => s.trim())
        : [],
      password: "password123", // Default password
      years_experience: 0,
    };

    // addTeacher(newTeacher);

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      subjects: "",
    });
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });
    onClose();
    alert("ask your administator to add a new teacher.");
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      subjects: "",
    });
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: "#ffffff", border: "2px solid #cccccc" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ color: "#004aad" }}>
            {t("school.addTeacher")}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl transition-all"
            style={{ background: "#dff3ff" }}
          >
            <X className="w-5 h-5" style={{ color: "#004aad" }} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: "#000000" }}
              >
                {t("profile.firstName")}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border"
                style={{
                  background: "#dff3ff",
                  borderColor: errors.firstName ? "#ff5757" : "#38b6ff",
                }}
                placeholder="Jean"
              />
              {errors.firstName && (
                <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: "#000000" }}
              >
                {t("profile.lastName")}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border"
                style={{
                  background: "#dff3ff",
                  borderColor: errors.lastName ? "#ff5757" : "#38b6ff",
                }}
                placeholder="Dupont"
              />
              {errors.lastName && (
                <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#000000" }}>
              {t("profile.email")}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: errors.email ? "#ff5757" : "#38b6ff",
              }}
              placeholder="jean.dupont@example.com"
            />
            {errors.email && (
              <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#000000" }}>
              {t("profile.phone")}
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phoneNumber: formatPhoneInput(e.target.value),
                })
              }
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: errors.phoneNumber ? "#ff5757" : "#38b6ff",
              }}
              placeholder="(###) ###-####"
              maxLength={14}
            />
            {errors.phoneNumber && (
              <p className="text-sm mt-1" style={{ color: "#ff5757" }}>
                {errors.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: "#000000" }}>
              {t("school.subjects")} ({t("school.optional")})
            </label>
            <input
              type="text"
              value={formData.subjects}
              onChange={(e) =>
                setFormData({ ...formData, subjects: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border"
              style={{
                background: "#dff3ff",
                borderColor: "#38b6ff",
              }}
              placeholder="Français, Mathématiques"
            />
            <p className="text-xs mt-1" style={{ color: "#666" }}>
              {t("school.subjectsHelp")}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleClose}
              label="common.cancel"
              variant="secondary"
              className="flex-1"
            />
            <Button
              onClick={handleSubmit}
              label="school.addTeacherButton"
              variant="primary"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
