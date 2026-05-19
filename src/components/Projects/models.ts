export interface Project {
  id: number;
  jobNumber: string;
  customerId: number;
  description?: string;
  startDate: string;
  completeDate?: string;
  notes?: ProjectNote[];
  documents?: ProjectDocument[];
}
// Also project status codes, but I think those can be derived from the presence or absence of other data -- add as its own field if easier

export interface ProjectNote {
  id: number;
  projectId: number;
  note: string;
  createdAt: Date;
  createdBy: number; // userId
}

export interface ProjectDocument {
  id: number;
  projectId: number;
  title: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: number; // userId
}

export interface ProjectWithDetails extends Project {
  customerName: string;
}

export interface ProjectCertification extends Project {
  id: number;
  listingNumber: string;
  projectCategories: number[];
  projectType: string;
}

export interface ProjectCertificationCategories {
  id: number;
  certificationCategoryId: number; // from CertificationCategories model in the Certification module
  productDescription: string;
  modelNumbers: string[]; // Is there any value in having this be an array instead of just a string list? Maybe to automate modifying the listing sheet?
}

export interface ProjectTesting extends Project {
  id: number;
  manufacturer: string;
  standardId: number[]; // from Standards model in the Standards module
  sampleDescription: string;
  samplePlan: string;
  samplingDate: string;
  samplingLocation: string;
}

export interface Sample {
  id: number;
  number: string;
  dateReceived: string;
  description: string;
  shippedVia: string;
  receivedBy: string;
  projectId?: number;
}

export interface ProjectInspection extends Project {
  id: number;
  inspectionLocation: string;
  inspectionType: string; // selected from a list of pre-defined inspection types; this determines the inspection data template
}

export interface ProjectLibrary extends Project {
  id: number;
  standardRevisionId: number[];
  checkoutDate: string;
  returnDate?: string | null;
}
