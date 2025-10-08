export interface Employee {
  id: number;
  name: string;
  homeAddress: string;
  homePhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  hireDate: string;
  terminationDate?: string;
}

export interface Role {
  id: number;
  title: string;
  supervisor: number; // ID of the *ROLE* (not the employee) that is the supervisor for this role
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
  trainingFocusAreas: string[];
}

export interface EmployeeRole {
  id: number;
  employeeId: number;
  roleId: number;
  startDate: string;
  endDate?: string;
  qualifications_verified_date: string;
  qualifications_verified_by: string;
  probation_verified_date: string;
  probation_verified_by: string;
}

export interface Training {
  id: number;
  date: string;
  description: string;
  areas: number[];
  file: string;
}

export interface PerformanceReview {
  id: number;
  given_date: string;
  given_by: string;
  responses: string[]; // Should be an array of question/answer objects
  employee_signed_date: string;
}
