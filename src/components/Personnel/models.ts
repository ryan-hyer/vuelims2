export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  homeAddress: string;
  homePhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  hireDate: string;
  terminationDate?: string | null;
  assignedRoles?: EmployeeRoleWithDetails[];
}

export interface EmployeeRoleWithDetails extends EmployeeRole {
  role: Role | null;
}

export interface Role {
  id: number;
  title: string;
  supervisor: number | null; // ID of the *ROLE* (not the employee) that is the supervisor for this role
  // This should assist in creating an org chart of some kind, and is necessary for things like performance reviews
  // This means that an employee with multiple roles might have a different supervisor for each role, which is probably okay
  // Except an employee only needs one performance review, etc., no matter how many roles they fill (right?) -- Needs more thought
  // The only problem with this is TEi-TS Laboratory Director, since there can be more than one -- Do I need to create a role for each one?
  // Example, a plumbing technician should report to the Plumbing Director, not any of the other Directors
  roleDescription: string;
  keyDuties: string[];
  authorizations: string[];
  hiringQualifications: string[];
  probationTargets: string[];
}

export interface EmployeeRole {
  id: number;
  employeeId: number;
  roleId: number;
  startDate: string;
  endDate: string | null;
  qualifications_verified_date: string | null;
  qualifications_verified_by: string | null;
  probation_verified_date: string | null;
  probation_verified_by: string | null;
}

export interface Training {
  id: number;
  employeeId: number;
  date: string;
  description: string;
  file: string | null;
  url: string | null;
}

export interface LegalDocument {
  id: number;
  title: string;
  description: string;
  filename: string | null;
  uploadDate: string | null;
  url: string | null;
}

export interface PerformanceReview {
  id: number;
  employeeId: number;
  given_date: string;
  given_by: string;
  employee_signed_date: string | null;
  A1: string | null;
  A2: string | null;
  A3: string | null;
  A4: string | null;
  A5: string | null;
  A6: string | null;
  B1: number | null;
  B2: number | null;
  B3: number | null;
  B4: number | null;
  B5: number | null;
  B6: number | null;
  B7: number | null;
  B8: number | null;
  B9: number | null;
  B10: number | null;
  B11: number | null;
  B12: number | null;
  B13: number | null;
  B14: number | null;
  B15: number | null;
  B16: number | null;
  C: string | null;
  D: string | null;
  E: string | null;
  F: string | null;
  G: string | null;
  H: string | null;
  I: string | null;
}
