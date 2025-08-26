export interface Customer {
  id: number;
  name: string;
  website: string;
  notes?: string;
}

export interface CustomerLocation {
  id: number;
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
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  notes?: string;
}

export interface CustomerInteraction {
  id: number;
  date: string;
  type: string; // e.g., 'call', 'meeting', 'email'
  with: string;
  description: string;
  followUpByDate?: string;
  followUpAction?: string;
  followUpAssignedTo?: string; // TODO: User ID, so this might be a number; change if necessary
  followUpCompleted?: boolean;
}
