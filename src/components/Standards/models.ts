export interface Standard {
  id: number;
  number: string;
  revision: string;
  title: string;
  ics_codes?: string[];
  webstore_url?: string | null;
  last_reviewed_date?: string | null;
  last_reviewed_by?: string | null;
  filename?: string;
  url?: string;
}
