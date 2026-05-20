export interface CertificationScheme {
  id: number;
  code: string;
  description: string;
}

export interface CertificationCategory {
  id: number;
  schemeId: number; // from CertificationScheme model
  code: string;
  description: string;
  fee: number;
}

export interface CertificationSubcategory {
  id: number;
  categoryId: number; // from CertificationCategory model
  code: string;
  description: string;
  fee: number;
}

export interface CertificationProductType {
  id: number;
  subcategoryId: number; // from CertificationSubcategory model
  code: string;
  description: string;
  fee: number;
  standardIds: number[]; // from Standards model in the Standards module
}

export interface CertificationCustomer {
  // This data essentially mirrors what is on an application/contract/certificate
  // and will be used for generating those documents
  id: number;
  customerId: number; // from Customers model in the Customers module for convenience in linking, but this is a one-to-one relationship
  companyName: string; // bunch of hardcoded data below since this is a record and needs to be immutable
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  website?: string;
  primaryContactId?: number; // from CustomerContacts model in the Customers module
  listingNumber: string; // sticking to our policy of one listing number per customer, but if this changes, move this field to the CertificationListing model
  // My old app had invoice amount, frequency, and month
  // But I don't need those here if the amount was always calculated based on the fee schedule, frequency was always annual, and month was always the same month their listing was granted -- ask Alona
  // Lately it seems like she doesn't even care about the month, so maybe just generate invoice reminders based on the previous invoice date, like inspections, or by calendar year
  // Might need to revisit this after we do the Invoicing module
  effectiveDate?: Date; // will be null until the listing is approved
  terminationDate?: Date;
  terminationReason?: string;
  status: 'pending' | 'canceled' | 'active' | 'suspended' | 'terminated';
  notes?: CertificationNote[];
  documents?: CertificationDocument[]; // for contracts and other docs related to the customer as a whole, not specific to a location or listing
  // This is sort of a weird reverse one-to-many
  // But the other option is nearly identical models for CertificationCustomerDocument, CertificationListingDocument, CertificationModelDocument, CertificationLocationDocument, etc., which seems way too complicated for what we need
}

export interface CertificationNote {
  id: number; // Do I need an id if these notes are intended to be stored as arrays of objects, rather than in its own table?
  note: string;
  createdAt: Date;
  createdBy: number; // userId
}

export interface CertificationDocument {
  id: number;
  description: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: number; // userId
}

export interface CertificationListing {
  id: number;
  certificationCustomerId: number; // from CertificationCustomer model
  productTypeId: number; // from CertificationProductType model
  standardRevisionIds: number[]; // for linking, and possibly checking whether a standard has a new revision in real time?
  standardRevisionsApproved: string[]; // hardcopied list of revisions approved for this listing; updating this will involve the standards revision workflow
  description: string;
  models: CertificationModel[];
  listingConditions: string[]; // these will be split into an ordered list for display
  hasCanada: boolean;
  status: 'pending' | 'approved' | 'archived';
  archivedAt?: string;
  notes?: string[];
  documents?: CertificationDocument[]; // for listing-specific documents that apply to all models within a category
}

export interface CertificationModel {
  id: number;
  modelNumber: string;
  description?: string;
  documents?: CertificationDocument[]; // for drawings and other docs related to a specific model
}

export interface CertificationLocation {
  id: number;
  certificationCustomerId: number; // from CertificationCustomer model
  customerLocationId: number; // from CustomerLocations model in the Customers module
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  // Going with only one contact per location for now, but if this changes, we'll need a CertificationLocationContact model and all that, but I don't think we'll need to go that far.
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'pending' | 'approved' | 'archived';
  archivedAt?: string;
  notes?: string[];
  documents?: CertificationDocument[]; // not sure what I'd use this for, but just in case
}

// Denormalized view types used for display

export interface CertificationListingDetail extends CertificationListing {
  models: CertificationModel[];
  displayLabel: string; // "[Scheme code] [Category description] - [Product type description] ([Combined code])"
}

export interface CertificationCustomerDetail extends CertificationCustomer {
  listings: CertificationListingDetail[];
  locations: CertificationLocation[];
  primaryContact?: { name: string; email?: string; phone?: string } | null;
}
