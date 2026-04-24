export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'auditor';
  employeeId: number | null;
}

export interface PasswordResetResult {
  sent: boolean;
  _mockToken?: string;
}
