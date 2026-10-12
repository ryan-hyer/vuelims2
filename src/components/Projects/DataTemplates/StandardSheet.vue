<template>
  <div>
    <div class="text-subtitle2 q-mb-sm row items-center">
      Product Details
      <q-space />
      <span class="text-caption text-grey-7 q-mr-sm">Units</span>
      <q-btn-toggle
        :model-value="data.units"
        @update:model-value="(u: UnitSystem) => convertSheetUnits(template, data, u)"
        :options="[
          { label: 'Imperial', value: 'imperial' },
          { label: 'Metric', value: 'metric' },
        ]"
        :readonly="readonly"
        dense
        no-caps
        unelevated
        size="sm"
        color="grey-3"
        text-color="grey-9"
        toggle-color="primary"
      />
    </div>
    <div class="row q-col-gutter-sm q-mb-md">
      <template v-for="f in template.inputs" :key="f.key">
        <TemplateField
          v-if="!f.section && isVisible(f, data.inputs)"
          v-model="data.inputs[f.key]!"
          :field="f"
          :inputs="data.inputs"
          :units="data.units"
          :readonly="readonly"
          class="col-12 col-md-6"
        />
      </template>
    </div>

    <div v-if="!detailsComplete" class="text-grey-7 text-italic">
      Fill in the product details above to see which sections of the standard apply.
    </div>
    <div v-else-if="!samples.length" class="text-grey-7 text-italic">
      Log the samples received (in Samples & Common Data) to record results for each one.
    </div>

    <template v-else>
      <q-card
        v-for="clause in template.clauses"
        :key="clause.number"
        flat
        bordered
        class="q-mb-sm"
        :class="{ 'bg-grey-1': status(clause) === 'n/a' }"
      >
        <q-card-section class="q-py-sm">
          <div class="row items-center q-gutter-x-sm">
            <q-icon v-bind="STATUS_ICON[status(clause)]" size="xs" />
            <div class="text-weight-bold">{{ clause.number }} {{ clause.title }}</div>
            <q-btn
              flat
              round
              dense
              size="sm"
              icon="info_outline"
              color="grey-7"
              @click="textClause = clause"
            >
              <q-tooltip>Show the text of this section</q-tooltip>
            </q-btn>
            <q-space />
            <q-chip
              dense
              square
              :color="STATUS_CHIP[status(clause)].color"
              :text-color="STATUS_CHIP[status(clause)].text"
            >
              {{
                naReason(clause) ? `N/A — ${naReason(clause)}` : STATUS_CHIP[status(clause)].label
              }}
            </q-chip>
            <q-btn
              v-if="!naReason(clause) && !readonly"
              flat
              dense
              no-caps
              size="sm"
              color="grey-7"
              :label="result(clause).markedNA ? 'Undo N/A' : 'Mark N/A'"
              @click="result(clause).markedNA = !result(clause).markedNA"
            >
              <q-tooltip v-if="!result(clause).markedNA">
                Section applies to this product but wasn't evaluated
              </q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <!-- Product-detail questions asked in this section. Always shown, since the answer
             can make the section N/A (e.g. a collapsible tank in 4.5) and must stay changeable -->
        <q-card-section v-if="visibleSectionInputs(clause).length" class="q-pt-none q-gutter-y-sm">
          <TemplateField
            v-for="f in visibleSectionInputs(clause)"
            :key="f.key"
            v-model="data.inputs[f.key]!"
            :field="f"
            :inputs="data.inputs"
            :units="data.units"
            :readonly="readonly"
          />
        </q-card-section>

        <q-card-section v-if="!naReason(clause)" class="q-pt-none">
          <template v-if="!result(clause).markedNA">
            <!-- Setup choices (e.g. test method), which decide what else the section asks -->
            <div class="q-gutter-y-sm q-mb-sm">
              <template v-for="f in setupFields(clause)" :key="f.key">
                <TemplateField
                  v-if="isVisible(f, data.inputs, result(clause).shared)"
                  v-model="result(clause).shared[f.key]!"
                  :field="f"
                  :inputs="data.inputs"
                  :units="data.units"
                  :values="result(clause).shared"
                  :readonly="readonly"
                />
              </template>
            </div>

            <template v-if="setupComplete(clause)">
              <!-- Other fields recorded once for all samples -->
              <div class="q-gutter-y-sm q-mb-sm">
                <template v-for="f in otherSharedFields(clause)" :key="f.key">
                  <TemplateField
                    v-if="isVisible(f, data.inputs, result(clause).shared)"
                    v-model="result(clause).shared[f.key]!"
                    :field="f"
                    :inputs="data.inputs"
                    :units="data.units"
                    :values="result(clause).shared"
                    :readonly="readonly"
                  />
                </template>
              </div>

              <!-- Fields recorded for each sample: one column per sample -->
              <div v-if="sampleRows(clause).length" class="table-scroll">
                <table class="sample-table">
                  <thead>
                    <tr>
                      <th class="text-left">Requirement</th>
                      <th v-for="s in samples" :key="s.key">
                        <div>{{ s.model || '—' }}</div>
                        <div class="text-caption text-grey-7">{{ s.key }}</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="f in sampleRows(clause)" :key="f.key">
                      <td class="row-label">
                        <div class="row items-center no-wrap">
                          <div class="col">
                            {{ f.label
                            }}<span v-if="f.optional" class="text-grey-6"> (optional)</span>
                            <div v-if="rowLimit(clause, f)" class="text-caption text-grey-7">
                              {{ rowLimit(clause, f) }}
                            </div>
                          </div>
                          <q-btn
                            v-if="samples.length > 1 && !readonly"
                            flat
                            round
                            dense
                            size="xs"
                            icon="keyboard_double_arrow_right"
                            color="grey-6"
                            @click="copyAcross(clause, f.key)"
                          >
                            <q-tooltip>Copy the first sample's value to all samples</q-tooltip>
                          </q-btn>
                        </div>
                      </td>
                      <td v-for="s in samples" :key="s.key" class="text-center">
                        <TemplateField
                          v-if="isVisible(f, data.inputs, sampleValues(result(clause), s.key))"
                          v-model="result(clause).samples[s.key]![f.key]!"
                          :field="f"
                          :inputs="data.inputs"
                          :units="data.units"
                          :values="sampleValues(result(clause), s.key)"
                          :readonly="readonly"
                          compact
                          class="justify-center"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="clause.isTest" class="q-mt-md">
                <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">
                  Test Conditions & Equipment
                </div>
                <div class="row q-col-gutter-sm items-start">
                  <DateInput
                    v-model="result(clause).conditions.testDate"
                    label="Test Date (yyyy/mm/dd)"
                    optional
                    :readonly="readonly"
                    class="col-12 col-sm-4"
                  />
                  <q-input
                    :model-value="result(clause).conditions.temperature ?? ''"
                    @update:model-value="
                      (v) => (result(clause).conditions.temperature = toNumber(v))
                    "
                    type="number"
                    filled
                    dense
                    label="Lab Temperature"
                    :suffix="temperatureUnit(data.units)"
                    :disable="result(clause).conditions.conditionsNotApplicable"
                    :readonly="readonly"
                    class="col-6 col-sm-3"
                  />
                  <q-input
                    :model-value="result(clause).conditions.humidityPct ?? ''"
                    @update:model-value="
                      (v) => (result(clause).conditions.humidityPct = toNumber(v))
                    "
                    type="number"
                    filled
                    dense
                    label="Humidity"
                    suffix="% RH"
                    :disable="result(clause).conditions.conditionsNotApplicable"
                    :readonly="readonly"
                    class="col-6 col-sm-3"
                  />
                  <q-checkbox
                    v-model="result(clause).conditions.conditionsNotApplicable"
                    label="N/A"
                    dense
                    :disable="readonly"
                    class="col-12 col-sm-2 q-mt-sm"
                  >
                    <q-tooltip>Lab conditions aren't relevant to this test</q-tooltip>
                  </q-checkbox>
                </div>
                <q-select
                  v-model="result(clause).conditions.equipmentIds"
                  :options="equipmentOptions"
                  option-value="id"
                  option-label="assetNumber"
                  emit-value
                  map-options
                  multiple
                  use-chips
                  filled
                  dense
                  options-dense
                  label="Equipment Used"
                  :readonly="readonly"
                  class="q-mt-sm"
                >
                  <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
                    <q-item v-bind="itemProps">
                      <q-item-section side>
                        <q-checkbox
                          :model-value="selected"
                          dense
                          @update:model-value="toggleOption(opt)"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ opt.assetNumber }} — {{ opt.description }}</q-item-label>
                        <q-item-label
                          caption
                          :class="{ 'text-negative': calOverdue(opt, result(clause)) }"
                        >
                          {{ calText(opt) }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <div
                  v-for="eq in overdueEquipment(result(clause))"
                  :key="eq.id"
                  class="text-negative text-caption q-mt-xs"
                >
                  <q-icon name="warning" /> {{ eq.assetNumber }} calibration was due
                  {{ eq.calibrationDueDate }}
                </div>
              </div>
            </template>
          </template>

          <q-input
            v-if="result(clause).markedNA || setupComplete(clause)"
            v-model="result(clause).findings"
            filled
            dense
            autogrow
            type="textarea"
            :label="findingsLabel(clause)"
            :readonly="readonly"
            class="q-mt-md"
          />
        </q-card-section>
      </q-card>
    </template>

    <q-dialog :model-value="!!textClause" @update:model-value="textClause = null">
      <q-card style="width: 720px; max-width: 95vw">
        <q-toolbar class="bg-grey-3">
          <q-toolbar-title class="text-subtitle1">
            {{ template.standardNumber }}-{{ template.revision }} · {{ textClause?.number }}
            {{ textClause?.title }}
          </q-toolbar-title>
          <q-btn flat round icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="standard-text">{{ textClause?.text }}</q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import DateInput from 'src/components/DateInput.vue';
import TemplateField from './TemplateField.vue';
import {
  clauseNotApplicable,
  clauseStatus,
  convertSheetUnits,
  inputsComplete,
  isVisible,
  sampleValues,
  sectionInputs,
  sheetContext,
  temperatureUnit,
} from './standards';
import type {
  ClauseDef,
  ClauseResult,
  ClauseStatus,
  FieldDef,
  StandardSheetData,
  StandardTemplate,
  UnitSystem,
} from './standards/types';
import type { Equipment } from '../../Equipment/models';

const props = defineProps<{
  template: StandardTemplate;
  samples: { key: string; model: string }[]; // key = sample number
  equipment: Equipment[];
  readonly?: boolean;
}>();

const data = defineModel<StandardSheetData>('data', { required: true });

const detailsComplete = computed(() => inputsComplete(props.template, data.value.inputs));
const ctx = computed(() =>
  sheetContext(
    props.template,
    data.value,
    props.samples.map((s) => s.key),
  ),
);

const textClause = ref<ClauseDef | null>(null);

const STATUS_CHIP: Record<ClauseStatus, { label: string; color: string; text: string }> = {
  complies: { label: 'Complies', color: 'green-1', text: 'positive' },
  'does-not-comply': { label: 'Does Not Comply', color: 'red-1', text: 'negative' },
  'n/a': { label: 'N/A', color: 'grey-3', text: 'grey-8' },
  incomplete: { label: 'In Progress', color: 'orange-1', text: 'orange-9' },
};

const STATUS_ICON: Record<ClauseStatus, { name: string; color: string }> = {
  complies: { name: 'check_circle', color: 'positive' },
  'does-not-comply': { name: 'cancel', color: 'negative' },
  'n/a': { name: 'remove_circle_outline', color: 'grey-5' },
  incomplete: { name: 'pending', color: 'orange' },
};

function result(clause: ClauseDef): ClauseResult {
  return data.value.clauses[clause.number]!;
}

function naReason(clause: ClauseDef) {
  return clauseNotApplicable(clause, data.value.inputs);
}

function status(clause: ClauseDef) {
  return clauseStatus(clause, result(clause), ctx.value);
}

function visibleSectionInputs(clause: ClauseDef) {
  return sectionInputs(clause, props.template.inputs).filter((f) =>
    isVisible(f, data.value.inputs),
  );
}

// Questions asked in the section and shared choices come first; the rest of the section
// appears once they're answered, since the answers decide what's asked
const isSetupField = (f: FieldDef) => f.shared && (f.type === 'select' || f.type === 'yesno');

function setupFields(clause: ClauseDef) {
  return clause.fields.filter(isSetupField);
}

function otherSharedFields(clause: ClauseDef) {
  return clause.fields.filter((f) => f.shared && !isSetupField(f));
}

function setupComplete(clause: ClauseDef) {
  const r = result(clause);
  const blank = (v: unknown) => v === null || v === '';
  return (
    visibleSectionInputs(clause).every((f) => !blank(data.value.inputs[f.key])) &&
    setupFields(clause)
      .filter((f) => isVisible(f, data.value.inputs, r.shared))
      .every((f) => !blank(r.shared[f.key]))
  );
}

// Per-sample fields shown for at least one sample
function sampleRows(clause: ClauseDef) {
  return clause.fields.filter(
    (f) =>
      !f.shared &&
      props.samples.some((s) =>
        isVisible(f, data.value.inputs, sampleValues(result(clause), s.key)),
      ),
  );
}

function rowLimit(clause: ClauseDef, f: FieldDef) {
  const first = props.samples[0];
  const values = first ? sampleValues(result(clause), first.key) : result(clause).shared;
  return f.limit?.(data.value.inputs, values, data.value.units)?.text;
}

function copyAcross(clause: ClauseDef, key: string) {
  const r = result(clause);
  const first = props.samples[0];
  if (!first) return;
  const value = r.samples[first.key]?.[key] ?? null;
  for (const s of props.samples) {
    const values = r.samples[s.key];
    if (values) values[key] = value;
  }
}

function findingsLabel(clause: ClauseDef) {
  if (result(clause).markedNA) return 'Reason not applicable (for report)';
  if (status(clause) === 'does-not-comply') {
    return 'Findings: describe the nonconformity (for report)';
  }
  return 'Additional findings (optional, for report)';
}

function toNumber(v: string | number | null) {
  return v === '' || v === null ? null : Number(v);
}

// --- Equipment ---
const equipmentOptions = computed(() =>
  [...props.equipment].sort((a, b) => a.assetNumber.localeCompare(b.assetNumber)),
);

function calText(eq: Equipment) {
  return eq.calibrationDueDate
    ? `Cert. ${eq.calibrationCertificate ?? '—'} · cal. due ${eq.calibrationDueDate}`
    : 'No calibration required';
}

// Overdue relative to the test date (or today, if no test date yet); dates are YYYY/MM/DD
function calOverdue(eq: Equipment, r: ClauseResult) {
  if (!eq.calibrationDueDate) return false;
  const ref = r.conditions.testDate || new Date().toISOString().slice(0, 10).replaceAll('-', '/');
  return eq.calibrationDueDate < ref;
}

function overdueEquipment(r: ClauseResult) {
  return props.equipment.filter(
    (eq) => r.conditions.equipmentIds.includes(eq.id) && calOverdue(eq, r),
  );
}
</script>

<style scoped>
.table-scroll {
  overflow-x: auto;
}
.sample-table {
  border-collapse: collapse;
  width: 100%;
}
.sample-table th,
.sample-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 4px 8px;
  vertical-align: middle;
}
.sample-table th {
  font-weight: 500;
  white-space: nowrap;
}
.row-label {
  min-width: 16em;
}
.standard-text {
  white-space: pre-wrap;
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.5;
  max-height: 70vh;
  overflow-y: auto;
}
</style>
