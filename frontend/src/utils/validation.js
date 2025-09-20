export const required = (message = 'This field is required') => (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return message;
  }
  return '';
};

export const email = (message = 'Please enter a valid email address') => (value) => {
  if (!value) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return message;
  }
  return '';
};

export const minLength = (min, message) => (value) => {
  if (!value) return '';
  if (value.length < min) {
    return message || `Must be at least ${min} characters long`;
  }
  return '';
};

export const maxLength = (max, message) => (value) => {
  if (!value) return '';
  if (value.length > max) {
    return message || `Must be no more than ${max} characters long`;
  }
  return '';
};

export const pattern = (regex, message) => (value) => {
  if (!value) return '';
  if (!regex.test(value)) {
    return message;
  }
  return '';
};

export const confirmPassword = (message = 'Passwords do not match') => (value, allValues) => {
  if (!value) return '';
  if (value !== allValues.password) {
    return message;
  }
  return '';
};

export const strongPassword = (message = 'Password must be at least 8 characters with at least one letter and one number') => (value) => {
  if (!value) return '';

  // Check minimum length
  if (value.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /\d/.test(value);

  if (!hasLetter || !hasNumber) {
    return 'Password must contain at least one letter and one number';
  }

  return '';
};

export const phone = (message = 'Please enter a valid phone number') => (value) => {
  if (!value) return '';
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(value)) {
    return message;
  }
  return '';
};