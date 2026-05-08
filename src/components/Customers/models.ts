export interface Customer {
  id: number;
  name: string;
  website?: string;
  notes?: string;
  locations?: CustomerLocation[];
  contacts?: CustomerContact[];
  interactions?: CustomerInteraction[];
}

export interface CustomerLocation {
  id: number;
  customerId: number;
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isPrimary: boolean; // Not sure about this one, might be hard to enforce
  notes?: string;
}

export interface CustomerContact {
  id: number;
  customerId: number;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  notes?: string;
}

export interface CustomerInteraction {
  id: number;
  customerId: number;
  date: string;
  type: string; // e.g., 'call', 'meeting', 'email'
  with: string;
  description: string;
  followUpByDate?: string;
  followUpAction?: string;
  followUpAssignedTo?: number;
  followUpCompleted?: boolean; // Might be better to make this a date?
}
