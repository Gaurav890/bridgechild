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

export const strongPassword = (message = 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character') => (value) => {
  if (!value) return '';
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!strongPasswordRegex.test(value)) {
    return message;
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