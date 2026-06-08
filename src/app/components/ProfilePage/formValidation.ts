export interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  school: string;
  startDate: string;
}

// Format phone number for display: (###) ###-####
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Format phone number as user types: (###) ###-####
export const formatPhoneInput = (value: string): string => {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, "");
  
  // Limit to 10 digits
  const limited = cleaned.slice(0, 10);
  
  // Format as user types
  if (limited.length === 0) return "";
  if (limited.length <= 3) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
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

  if (formData.phone) {
    const cleaned = formData.phone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      errors.phone = t("profile.errors.phoneInvalid");
    }
  }

  const isValid = !Object.values(errors).some((error) => error !== "");

  return { isValid, errors };
};
