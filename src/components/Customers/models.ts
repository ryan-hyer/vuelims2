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
  address: string;
  city: string;
  customerState: string;
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
  followUpAssignedTo?: string; // TODO: User ID, so this might be a number; change if necessary
  followUpCompleted?: boolean;
}
