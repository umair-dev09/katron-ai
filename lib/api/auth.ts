// Auth API Service for Katron AI Gift Card Platform
// Uses Next.js API routes as proxy to avoid CORS issues

// External API base URL (used only in server-side proxy routes)
export const EXTERNAL_API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

// Helper function to get the base URL for API calls
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use relative URL
    return ""
  }
  // Server-side: use absolute URL
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

// Types based on OpenAPI spec
export interface RegisterAddressModel {
  addressLine1: string;
  addressLine2?: string;
  currentLocation?: string;
  currentLocationLat?: number;
  currentLocationLng?: number;
  city?: string;
  country: string; // 2 character country code
  state?: string;
  zipcode?: string;
}

export interface RegisterModel {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string; // min 9 characters
  address: RegisterAddressModel;
  profilePhoto?: string;
  about?: string;
  accountType: "MERCHANT" | "USER" | "ADMIN" | "SUPER_ADMIN";
}

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  accountType: "MERCHANT" | "USER" | "ADMIN" | "SUPER_ADMIN";
  emailVerified: boolean;
  phoneVerified: boolean;
  profilePhoto?: string;
  about?: string;
  address?: RegisterAddressModel;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

// Google Login Request interface
export interface GoogleLoginRequest {
  idToken: string;
  accountType: "MERCHANT" | "USER" | "ADMIN" | "SUPER_ADMIN";
}

// Custom error class for API errors
export class AuthApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  // Log for debugging
  console.log("[Auth API] Response:", { status: response.status, data });
  
  // Handle error responses
  // Check both HTTP status and the status field in response body
  const isError = !response.ok || (data.status && data.status >= 400);
  
  if (isError) {
    throw new AuthApiError(
      data.message || "An error occurred",
      data.status || response.status
    );
  }
  
  // Normalize the response
  return {
    status: data.status || response.status,
    message: data.message || "",
    data: data.data || data,
  };
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Register a new user
 * POST /api/auth/register (proxied)
 */
export async function register(data: RegisterModel): Promise<ApiResponse<UserData>> {
  const response = await fetch(`${getBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  return handleResponse<UserData>(response);
}

/**
 * Login user
 * POST /api/auth/login (proxied)
 */
export async function login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
  const params = new URLSearchParams({
    email,
    password,
  });
  
  const response = await fetch(`${getBaseUrl()}/api/auth/login?${params.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  return handleResponse<LoginResponse>(response);
}

/**
 * Google Login
 * POST /api/auth/google (proxied)
 * @param idToken - Google ID token from Google Sign-In
 * @param accountType - Account type: MERCHANT or USER
 */
export async function googleLogin(
  idToken: string,
  accountType: "MERCHANT" | "USER" | "ADMIN" | "SUPER_ADMIN"
): Promise<ApiResponse<LoginResponse>> {
  const response = await fetch(`${getBaseUrl()}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken,
      accountType,
    }),
  });
  
  return handleResponse<LoginResponse>(response);
}

/**
 * Verify email OTP
 * POST /api/auth/verify-email-otp (proxied)
 */
export async function verifyEmailOtp(otp: string): Promise<ApiResponse<UserData>> {
  const params = new URLSearchParams({ otp });
  
  const response = await fetch(`${getBaseUrl()}/api/auth/verify-email-otp?${params.toString()}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  
  return handleResponse<UserData>(response);
}

/**
 * Resend email verification OTP
 * POST /api/auth/resend-email-otp (proxied)
 */
export async function resendEmailVerificationOtp(): Promise<ApiResponse<null>> {
  const response = await fetch(`${getBaseUrl()}/api/auth/resend-email-otp`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  
  return handleResponse<null>(response);
}

/**
 * Verify phone OTP
 * POST /api/auth/verifyPhoneOtp
 * Note: Not proxied yet - will need proxy route when used
 */
export async function verifyPhoneOtp(otp: string): Promise<ApiResponse<UserData>> {
  const params = new URLSearchParams({ otp });
  
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/verifyPhoneOtp?${params.toString()}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  
  return handleResponse<UserData>(response);
}

/**
 * Send OTP for phone verification
 * POST /api/auth/sendOtpForPhoneVerification
 * Note: Not proxied yet - will need proxy route when used
 */
export async function sendPhoneVerificationOtp(): Promise<ApiResponse<null>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/sendOtpForPhoneVerification`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  
  return handleResponse<null>(response);
}

/**
 * Resend phone verification OTP
 * POST /api/auth/resendOtpForPhoneVerification
 * Note: Not proxied yet - will need proxy route when used
 */
export async function resendPhoneVerificationOtp(): Promise<ApiResponse<null>> {
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/auth/resendOtpForPhoneVerification`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  
  return handleResponse<null>(response);
}

/**
 * Forgot password - send reset OTP
 * POST /api/auth/forgot-password (proxied)
 * Returns a temporary token that must be used for resetPassword and resendOtpForResetPassword
 */
export interface ForgotPasswordResponse {
  token?: string;
}

export async function forgotPassword(email: string): Promise<ApiResponse<ForgotPasswordResponse>> {
  const response = await fetch(`${getBaseUrl()}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  
  return handleResponse<ForgotPasswordResponse>(response);
}

/**
 * Resend OTP for password reset
 * POST /api/auth/resend-reset-otp (proxied)
 * Requires the temporary token from forgotPassword
 */
export async function resendResetPasswordOtp(tempToken: string): Promise<ApiResponse<null>> {
  const response = await fetch(`${getBaseUrl()}/api/auth/resend-reset-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tempToken}`,
    },
  });
  
  return handleResponse<null>(response);
}

/**
 * Reset password with OTP
 * POST /api/auth/reset-password (proxied)
 * Requires the temporary token from forgotPassword
 */
export async function resetPassword(
  otp: string,
  newPassword: string,
  confirmPassword: string,
  tempToken: string
): Promise<ApiResponse<null>> {
  const response = await fetch(`${getBaseUrl()}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tempToken}`,
    },
    body: JSON.stringify({ otp, newPassword, confirmPassword }),
  });
  
  return handleResponse<null>(response);
}

/**
 * Get current user
 * GET /api/user (proxied)
 */
export async function getCurrentUser(): Promise<ApiResponse<UserData>> {
  const response = await fetch(`${getBaseUrl()}/api/user`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  
  return handleResponse<UserData>(response);
}

/**
 * Change password
 * POST /api/user/changePassword
 * Note: Not proxied yet - will need proxy route when used
 */
export async function changePassword(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponse<null>> {
  const params = new URLSearchParams({
    oldPassword,
    newPassword,
    confirmPassword,
  });
  
  const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/changePassword?${params.toString()}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  
  return handleResponse<null>(response);
}

// Cookie helpers
function setCookie(name: string, value: string, days: number = 5): void {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
}

function getCookie(name: string): string | null {
  if (typeof window !== "undefined") {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
  }
  return null;
}

function deleteCookie(name: string): void {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

// Token management - store in both localStorage and cookies
export function saveAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
    setCookie("authToken", token, 5); // 5 days to match JWT expiry
    console.log("[Auth] Token saved to localStorage and cookie");
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    // Try localStorage first, then cookie
    const token = localStorage.getItem("authToken") || getCookie("authToken");
    return token;
  }
  return null;
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    deleteCookie("authToken");
    console.log("[Auth] Token removed from localStorage and cookie");
  }
}

export function saveUserData(user: UserData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(user));
  }
}

export function getUserData(): UserData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("userData");
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function removeUserData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData");
  }
}

export function clearAuthData(): void {
  removeAuthToken();
  removeUserData();
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
