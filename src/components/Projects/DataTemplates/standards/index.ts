import type {
  ClauseDef,
  ClauseResult,
  ClauseStatus,
  FieldDef,
  Quantity,
  SheetContext,
  StandardSheetData,
  StandardTemplate,
  UnitSystem,
  Values,
} from './types';
import iapmoTs4_2015 from './iapmo-ts-4-2015';

const TEMPLATES: StandardTemplate[] = [iapmoTs4_2015];

export function findStandardTemplate(
  standardNumber: string,
  revision: string,
): StandardTemplate | undefined {
  return TEMPLATES.find((t) => t.standardNumber === standardNumber && t.revision === revision);
}

// --- Units ---

const QUANTITIES: Record<Quantity, { imperial: string; metric: string; toMetric: number }> = {
  length: { imperial: 'in', metric: 'mm', toMetric: 25.4 },
  pressure: { imperial: 'psi', metric: 'kPa', toMetric: 6.894757 },
};

export function unitLabel(field: FieldDef, units: UnitSystem): string | undefined {
  return field.quantity ? QUANTITIES[field.quantity][units] : field.unit;
}

export const temperatureUnit = (units: UnitSystem) => (units === 'metric' ? '°C' : '°F');

const round = (n: number) => Number(n.toPrecision(4));

function convertValue(value: unknown, quantity: Quantity, to: UnitSystem): unknown {
  if (typeof value !== 'number') return value;
  const factor = QUANTITIES[quantity].toMetric;
  return round(to === 'metric' ? value * factor : value / factor);
}

function convertValues(values: Values, fields: FieldDef[], to: UnitSystem) {
  for (const f of fields) {
    if (f.quantity && f.key in values) {
      values[f.key] = convertValue(values[f.key], f.quantity, to) as Values[string];
    }
  }
}

// Switches the sheet's unit system, converting everything already entered
export function convertSheetUnits(
  template: StandardTemplate,
  data: StandardSheetData,
  to: UnitSystem,
) {
  if (data.units === to) return;
  convertValues(data.inputs, template.inputs, to);
  for (const c of template.clauses) {
    const r = data.clauses[c.number];
    if (!r) continue;
    convertValues(r.shared, c.fields, to);
    for (const values of Object.values(r.samples)) convertValues(values, c.fields, to);
    const t = r.conditions.temperature;
    if (t !== null) {
      r.conditions.temperature = round(to === 'metric' ? ((t - 32) * 5) / 9 : (t * 9) / 5 + 32);
    }
  }
  data.units = to;
}

// --- Data defaults ---

function emptyValues(fields: FieldDef[], saved?: Values): Values {
  const values: Values = {};
  for (const f of fields) values[f.key] = saved?.[f.key] ?? null;
  return values;
}

// Fills in anything the saved data is missing, so the form can bind to every field
export function normalizeSheetData(
  template: StandardTemplate,
  data: Partial<StandardSheetData>,
  sampleKeys: string[],
): StandardSheetData {
  const clauses: Record<string, ClauseResult> = {};
  for (const c of template.clauses) {
    const saved = data.clauses?.[c.number];
    const perSample = c.fields.filter((f) => !f.shared);
    const samples: Record<string, Values> = {};
    // Keep data for removed samples too, in case the sample comes back
    for (const key of new Set([...Object.keys(saved?.samples ?? {}), ...sampleKeys])) {
      samples[key] = emptyValues(perSample, saved?.samples?.[key]);
    }
    clauses[c.number] = {
      markedNA: saved?.markedNA ?? false,
      findings: saved?.findings ?? '',
      shared: emptyValues(
        c.fields.filter((f) => f.shared),
        saved?.shared,
      ),
      samples,
      conditions: {
        testDate: '',
        temperature: null,
        humidityPct: null,
        conditionsNotApplicable: false,
        equipmentIds: [],
        ...saved?.conditions,
      },
    };
  }
  return {
    units: data.units ?? 'imperial',
    inputs: emptyValues(template.inputs, data.inputs),
    clauses,
  };
}

// --- Evaluation ---

export function isVisible(field: FieldDef, inputs: Values, values: Values = {}) {
  return field.showIf ? field.showIf(inputs, values) : true;
}

function isBlank(value: unknown) {
  return value === null || value === undefined || (typeof value === 'string' && !value.trim());
}

// Shared values plus one sample's own values
export function sampleValues(result: ClauseResult, sampleKey: string): Values {
  return { ...result.shared, ...result.samples[sampleKey] };
}

// 'pass' / 'fail' for requirements and limited numbers; null when there's nothing to judge
export function fieldStatus(
  field: FieldDef,
  value: unknown,
  inputs: Values,
  values: Values,
  units: UnitSystem,
): 'pass' | 'fail' | null {
  if (isBlank(value)) return null;
  if (field.type === 'requirement') {
    if (value === 'complies') return 'pass';
    return value === 'does-not-comply' ? 'fail' : null;
  }
  if (field.type === 'select') {
    return field.options?.find((o) => o.value === value)?.fails ? 'fail' : null;
  }
  const limit = field.limit?.(inputs, values, units);
  if (!limit || field.type !== 'number') return null;
  const n = Number(value);
  if (limit.min !== undefined && n < limit.min) return 'fail';
  if (limit.max !== undefined && n > limit.max) return 'fail';
  return 'pass';
}

export function clauseNotApplicable(clause: ClauseDef, inputs: Values): string | null {
  return clause.notApplicable?.(inputs) ?? null;
}

// Product-detail questions asked inside this section
export function sectionInputs(clause: ClauseDef, inputFields: FieldDef[]) {
  return inputFields.filter((f) => f.section === clause.number);
}

// Every (field, values) pair to evaluate: section questions and shared fields once,
// per-sample fields for each sample
function fieldEntries(clause: ClauseDef, result: ClauseResult, ctx: SheetContext) {
  const entries: { field: FieldDef; values: Values; value: unknown }[] = [];
  for (const field of sectionInputs(clause, ctx.inputFields)) {
    if (isVisible(field, ctx.inputs)) {
      entries.push({ field, values: ctx.inputs, value: ctx.inputs[field.key] });
    }
  }
  for (const field of clause.fields) {
    if (field.shared) {
      if (isVisible(field, ctx.inputs, result.shared)) {
        entries.push({ field, values: result.shared, value: result.shared[field.key] });
      }
      continue;
    }
    for (const key of ctx.samples) {
      const values = sampleValues(result, key);
      if (isVisible(field, ctx.inputs, values)) {
        entries.push({ field, values, value: values[field.key] });
      }
    }
  }
  return entries;
}

export function clauseHasFailure(clause: ClauseDef, result: ClauseResult, ctx: SheetContext) {
  return fieldEntries(clause, result, ctx).some(
    (e) => fieldStatus(e.field, e.value, ctx.inputs, e.values, ctx.units) === 'fail',
  );
}

// What's still needed for one clause, as short labels
export function clauseMissing(
  clause: ClauseDef,
  result: ClauseResult,
  ctx: SheetContext,
): string[] {
  if (clauseNotApplicable(clause, ctx.inputs)) return [];
  if (result.markedNA) return result.findings.trim() ? [] : ['reason for N/A'];
  if (!ctx.samples.length && clause.fields.some((f) => !f.shared)) return ['samples'];
  const missing = new Set(
    fieldEntries(clause, result, ctx)
      .filter((e) => !e.field.optional && isBlank(e.value))
      .map((e) => e.field.label.toLowerCase()),
  );
  if (clauseHasFailure(clause, result, ctx) && !result.findings.trim()) {
    missing.add('findings for the nonconformity');
  }
  if (clause.isTest) {
    const c = result.conditions;
    if (!c.testDate) missing.add('test date');
    if (!c.conditionsNotApplicable && (c.temperature === null || c.humidityPct === null)) {
      missing.add('lab conditions');
    }
    if (!c.equipmentIds.length) missing.add('equipment');
  }
  return [...missing];
}

// A failure shows as soon as it's recorded, even if other fields are still blank
export function clauseStatus(
  clause: ClauseDef,
  result: ClauseResult,
  ctx: SheetContext,
): ClauseStatus {
  if (clauseNotApplicable(clause, ctx.inputs) || result.markedNA) return 'n/a';
  if (clauseHasFailure(clause, result, ctx)) return 'does-not-comply';
  return clauseMissing(clause, result, ctx).length ? 'incomplete' : 'complies';
}

// Product details asked up front decide which clauses apply, so they come first
export function inputsComplete(template: StandardTemplate, inputs: Values) {
  return !template.inputs.some(
    (f) => !f.section && !f.optional && isVisible(f, inputs) && isBlank(inputs[f.key]),
  );
}

export function sheetContext(
  template: StandardTemplate,
  data: StandardSheetData,
  samples: string[],
): SheetContext {
  return { inputs: data.inputs, inputFields: template.inputs, units: data.units, samples };
}

// Section-level summary for the whole sheet, e.g. ['4.3', '5.1']
export function sheetMissing(
  template: StandardTemplate,
  data: StandardSheetData,
  samples: string[],
): string[] {
  if (!inputsComplete(template, data.inputs)) return ['product details'];
  const ctx = sheetContext(template, data, samples);
  return template.clauses
    .filter((c) => {
      const r = data.clauses[c.number];
      return r && clauseMissing(c, r, ctx).length;
    })
    .map((c) => c.number);
}
