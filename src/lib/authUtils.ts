import Cookies from "js-cookie";

/**
 * Check if user is authenticated by verifying JWT token presence
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = Cookies.get("jwt_Token");
  return !!token;
}

/**
 * Get current user model from localStorage
 */
export function getUserModel(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem("model");
}

/**
 * Get current user info from localStorage
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  const model = localStorage.getItem("model");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  
  if (!model) return null;
  
  return { model, email, name };
}

/**
 * Check if user is authenticated as a teacher
 */
export function isTeacherAuthenticated(): boolean {
  return isAuthenticated() && getUserModel()?.toLowerCase() === "teacher";
}

/**
 * Check if user is authenticated as a student
 */
export function isStudentAuthenticated(): boolean {
  return isAuthenticated() && getUserModel()?.toLowerCase() === "student";
}