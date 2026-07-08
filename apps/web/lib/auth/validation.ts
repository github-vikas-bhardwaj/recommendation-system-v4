export type AuthFieldErrors = {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
};

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return "Email is required.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return "Password is required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return undefined;
}

export function validateName(name: string): string | undefined {
  if (!name.trim()) {
    return "Name is required.";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }
  return undefined;
}

export function hasFieldErrors(errors: AuthFieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}
