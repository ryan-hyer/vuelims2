import type { CertificationLocation } from '../Certification/models';

export interface Project {
  id: number;
  jobNumber: string;
  typeCode: string; // from projecttypes: 'A' | 'E' | 'F' | 'M' | 'P' | 'ST' | 'I' | 'LS' | 'LIB'
  customerId: number;
  description?: string;
  startDate: string;
  completeDate?: string;
  notes?: ProjectNote[];
  documents?: ProjectDocument[];
  dataLockedAt?: string; // set by "Complete & Lock"; all project data is read-only while set
  dataLockedBy?: number; // userId
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
  standardIds: number[]; // from Standards model in the Standards module
}

// A sample always belongs to exactly one project
export interface Sample {
  id: number;
  projectId: number;
  number: string;
  dateReceived: string;
  description: string;
  shippedVia: string;
  receivedBy: string;
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

// A sample being entered or edited; id is assigned on save
export type DraftSample = Omit<Sample, 'id' | 'projectId'> & { id?: number };

// --- Project Data ---
// A project's data is stored as one or more data sheets, generated from the project's type.
// Locking is done for the whole project at once (Project.dataLockedAt).

export type DataSheetKind =
  | 'testing-common' // sample info + anything shared across standards
  | 'testing-standard' // one per standard on the project
  | 'inspection-checklist' // template chosen by inspectionType
  | 'certification'; // LS datasheet

export interface DataSheet<T = Record<string, unknown>> {
  id: number;
  projectId: number;
  kind: DataSheetKind;
  templateKey: string; // selects the form component, e.g. 'testing-common', 'astm-e84'
  standardId?: number; // testing-standard only
  standardRevisionId?: number; // testing-standard only: defaults to the latest revision
  data: T;
  savedAt?: string;
  savedBy?: number; // userId
}

export interface ManufacturerInfo {
  name: string;
  address1: string;
  address2: string; // the only optional field
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  website: string;
}

export interface TestingCommonData {
  manufacturer: ManufacturerInfo;
  sampleDescription: string;
  samplePlan: string;
  samplingDate: string; // YYYY/MM/DD
  samplingLocation: string;
}

// Snapshot taken when locked data is formally revised (not yet implemented)
export interface ProjectDataRevision {
  id: number;
  projectId: number;
  revision: number;
  reason: string;
  requestedBy: number; // userId
  requestedAt: string;
  previousSheets: DataSheet[];
}

export interface ProjectDataBundle {
  sheets: DataSheet[];
  samples: Sample[];
  lockedByName?: string;
}
