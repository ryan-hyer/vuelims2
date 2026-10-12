// Standard datasheets are defined as data: one StandardTemplate per standard revision,
// rendered by StandardSheet.vue. Sections of the standard with no requirements are left out.

export type FieldValue = string | number | null;
export type Values = Record<string, FieldValue>;

export type UnitSystem = 'imperial' | 'metric';

// Quantities that convert between unit systems; other units (e.g. 'min') are fixed
export type Quantity = 'length' | 'pressure';

export interface FieldOption {
  label: string;
  value: string;
  fails?: boolean; // choosing this option means the requirement isn't met
}

export interface Limit {
  min?: number;
  max?: number;
  text: string; // shown next to the field, e.g. '≥ 0.0160 in'
}

export interface FieldDef {
  key: string;
  label: string;
  // 'requirement' stores 'complies' | 'does-not-comply' (| 'n/a' with allowNA): a compliance
  // determination for one requirement. 'yesno' stores 'yes' | 'no' for plain product facts.
  // Numbers with a limit are judged automatically.
  type: 'requirement' | 'number' | 'text' | 'select' | 'yesno';
  quantity?: Quantity; // number fields in convertible units
  unit?: string; // number fields in fixed units
  options?: FieldOption[];
  allowNA?: boolean;
  optional?: boolean;
  // Clause fields are recorded per sample unless shared (one value for all samples)
  shared?: boolean;
  // Product details only: ask this question inside the given section instead of up front
  // (e.g. material in 4.2), while other sections can still depend on the answer
  section?: string;
  // inputs = sheet-level product details; values = shared + this sample's values
  showIf?: (inputs: Values, values: Values) => boolean;
  // Limits come from the standard in each unit system (they aren't always exact conversions)
  limit?: (inputs: Values, values: Values, units: UnitSystem) => Limit | null;
}

export interface ClauseDef {
  number: string;
  title: string;
  text: string; // the section's text as written in the standard, for reference
  // Returns the reason this clause doesn't apply to the product, or null if it does
  notApplicable?: (inputs: Values) => string | null;
  // Tests record conditions (date, temperature, humidity) and the equipment used
  isTest?: boolean;
  fields: FieldDef[];
}

export interface StandardTemplate {
  key: string;
  standardNumber: string;
  revision: string;
  inputs: FieldDef[]; // product details that decide which clauses and limits apply
  clauses: ClauseDef[];
}

// Worked out from the clause's requirements; never stored
export type ClauseStatus = 'complies' | 'does-not-comply' | 'n/a' | 'incomplete';

// --- Saved data shape (DataSheet.data for a testing-standard sheet) ---

export interface TestConditions {
  testDate: string; // YYYY/MM/DD
  temperature: number | null; // °F or °C, per the sheet's unit system
  humidityPct: number | null;
  conditionsNotApplicable: boolean;
  equipmentIds: number[];
}

export interface ClauseResult {
  markedNA: boolean; // applies to the product in principle, but not evaluated (reason in findings)
  findings: string; // goes into the report's FINDINGS paragraph
  shared: Values;
  samples: Record<string, Values>; // keyed by sample number
  conditions: TestConditions;
}

export interface StandardSheetData {
  units: UnitSystem;
  inputs: Values;
  clauses: Record<string, ClauseResult>;
}

// What the evaluation functions need to know about the sheet
export interface SheetContext {
  inputs: Values;
  inputFields: FieldDef[]; // the template's product-detail definitions
  units: UnitSystem;
  samples: string[]; // sample numbers being tested
}
