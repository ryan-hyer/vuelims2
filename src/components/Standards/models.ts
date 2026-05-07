export interface Standard {
  id: number;
  number: string;
  title: string;
  ics_codes?: string[];
  webstore_url?: string | null;
  last_reviewed_date?: string | null;
  last_reviewed_by?: string | null;
}

export interface StandardRevision {
  id: number;
  standardId: number; // from Standard model
  revision: string;
  filename?: string;
  url?: string;
}
