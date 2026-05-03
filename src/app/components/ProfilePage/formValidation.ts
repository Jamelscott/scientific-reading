export interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  startDate: string;
}

// Format phone number for display: (111) 111-1111
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Validate form fields
export const validateForm = (
  formData: FormData,
  t: (key: string) => string,
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    school: "",
  };

  if (!formData.firstName.trim()) {
    errors.firstName = t("profile.errors.firstNameRequired");
  }

  if (!formData.lastName.trim()) {
    errors.lastName = t("profile.errors.lastNameRequired");
  }

  if (!formData.email.trim()) {
    errors.email = t("profile.errors.emailRequired");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = t("profile.errors.emailInvalid");
  }

  if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
    errors.phone = t("profile.errors.phoneInvalid");
  }

  if (!formData.school.trim()) {
    errors.school = t("profile.errors.schoolRequired");
  }

  const isValid = !Object.values(errors).some((error) => error !== "");

  return { isValid, errors };
};
