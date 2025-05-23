// Email validations
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validations
export const validatePasswordLength = (password: string): boolean => {
  return password.length >= 8;
};

// Username validations
export const validateUsername = (username: string): string | null => {
  if (!username.trim()) return "Please enter a username";
  if (username.length < 5 || username.length > 30) return "Username must be between 5 and 30 characters long";
  return null;
};

// Course name validations
export const validateCourse = (name: string): string | null => {
  if (!name.trim()) return "Please enter a course name";
  if (name.length < 5) return "Course name must be at least 5 characters long";
  if (name.length > 30) return "Course name cannot be longer than 30 characters";
  return null;
};

// Sign-in validations
export const validateSignIn = (email: string, password: string): string | null => {
  if (!email.trim()) return "Required fields are empty (email)";
  if (!validateEmail(email)) return "Please enter a valid email address";
  if (!password) return "Required fields are empty (password)";
  if (!validatePasswordLength(password)) return "The password must have more than 8 characters.";
  return null;
};
