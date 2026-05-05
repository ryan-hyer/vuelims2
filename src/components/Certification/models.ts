export interface CertificationCategory {
  id: number;
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
  // I hate this name, try to think of something better
  id: number;
  customerId: number; // from Customers model in the Customers module
  listingNumber: string;
  effectiveDate: Date;
  terminationDate?: Date;
}

export interface CertificationCertification {
  // I'm definitely not a fan of this name either
  id: number;
  certificationCustomerId: number; // from CertificationCustomer model
  productTypeId: number; // from CertificationProductType model
  standardIds: number[]; // from Standards model in the Standards module
  description: string;
  modelNumbers: string[];
  listingConditions: string;
  hasCanada: boolean;
}

export interface CertificationLocation {
  /*
  And here we get into the debate about linking versus copying data. Generally, I think we want records to be immutable data, including completed listings.
  Put some thought into what happens with a listing if the customer info is changed in some unrelated operation, like an address is changed without going through
  the process of approving the new location and updating the listing.
  */
  id: number;
  certificationCustomerId: number; // from CertificationCustomer model
  name?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isPrimary: boolean; // Not sure about this one, might be hard to enforce
  notes?: string;
}

export interface CertificationContact {
  id: number;
  certificationCustomerId: number; // from CertificationCustomer model
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  contractSigner: boolean; // Do I really need this, especially when I'm planning to make the contract itself viewable with a single click?
  notes?: string;
}
