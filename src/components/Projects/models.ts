import type { CertificationLocation } from '../Certification/models';

export interface Project {
  id: number;
  jobNumber: string;
  customerId: number;
  description?: string;
  startDate: string;
  completeDate?: string;
  notes?: ProjectNote[];
  documents?: ProjectDocument[];
  // Also project status codes, but I think those can be derived from the presence or absence of other data -- add as its own field if easier
}

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
  listingNumber?: string;
  projectSubtype: string; // new, scope change, redesign, facility, other
  projectCategories?: ProjectCertificationCategories[]; // only for new, scope change, and redesign subtypes
  newFacility?: CertificationLocation; // only for new and facility subtypes
  oldFacility?: CertificationLocation; // only for facility subtype
}

export interface ProjectCertificationCategories {
  id: number;
  certificationProductTypeId: number;
  newModelNumbers?: string[]; // new + scope change: model numbers being added
  affectedModels?: { id: number; modelNumber: string }[]; // redesign: existing models in scope
  removedModels?: { id: number; modelNumber: string }[]; // scope change: existing models being removed
}

export interface ProjectTesting extends Project {
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
  inspectionLocation: string;
  inspectionType: string; // selected from a list of pre-defined inspection types; this determines the inspection data template
}

export interface ProjectLibrary extends Project {
  standardRevisionIds: number[];
  checkoutDate: string;
  returnDate?: string | null;
}
