export interface Project {
  id: number;
  number: string; // unique identifier; could I use this as the primary key?
  customer: string; // should ultimately be clientId: number;
  description: string;
  startDate: string;
  standards?: string[]; // call this something else, since it can encompass LS and IS checklists also - requiredData? - values should point to templates, and should also record whether data entry is complete
  purchaseOrder?: string; // ask how much we need this field, and whether I'm missing any others
  assignedTo?: string; // should ultimately be a number linked to personnelId, and should be non optional
  completeDate?: string;
}

export interface Sample {
  id: number;
  number: string; // unique identifier; could I use this as the primary key?
  // projectId: number;
  dateReceived: string;
  description: string;
  shippedVia: string;
  receivedBy: string;
}
