export interface Project {
  id: number;
  number: string;
  customerId: number;
  description: string;
  startDate: string;
  standards?: string[];
  purchaseOrder?: string;
  assignedEmployeeId: number | null;
  completeDate?: string;
}

export interface ProjectWithDetails extends Project {
  customerName: string;
  assignedEmployeeName: string | null;
}

export interface Sample {
  id: number;
  number: string;
  dateReceived: string;
  description: string;
  shippedVia: string;
  receivedBy: string;
}
