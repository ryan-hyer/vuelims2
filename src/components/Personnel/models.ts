export interface Employee {
  id: number;
  name: string;
  homeAddress: string;
  homePhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  hireDate: string;
  terminationDate?: string;
  roles: number[];
}

export interface Role {
  id: number;
  title: string;
  description: string;
  keyDuties: string[];
  authorizations: string[];
  hiring_qualifications: string[];
  probation_targets: string[];
  training_areas: string[];
  // TODO: Double-check that the below stuff is the way I actually want this, since this data is probably going to come out of an employee/role join table
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
  responses: string[];
  // TODO: Instead of an array of strings, can we have an array of question/answer objects? What happens if the questions change?
  employee_signed_date: string;
}
