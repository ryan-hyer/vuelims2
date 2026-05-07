<template>
  <div v-if="!isEditing" class="q-pa-md bg-grey-2">
    <div class="row q-gutter-lg q-mb-md">
      <div>
        <div class="text-caption text-grey">ICS Codes</div>
        <div v-if="!(row.ics_codes ?? []).length" class="text-body2">—</div>
        <div v-else class="text-body2">
          <template v-for="(code, i) in row.ics_codes" :key="code">
            <span
              v-if="!clickTooltips"
              class="cursor-help"
              style="border-bottom: 1px dotted currentColor"
            >
              {{ code }}
              <q-tooltip v-if="icsInfo[code]" max-width="320px">
                <div class="text-caption">{{ icsInfo[code].description }}</div>
              </q-tooltip>
            </span>
            <span v-else class="cursor-pointer" style="border-bottom: 1px dotted currentColor">
              {{ code }}
              <q-menu v-if="icsInfo[code]" anchor="bottom left" self="top left">
                <q-card flat class="q-pa-sm" style="max-width: 320px">
                  <div class="text-caption">{{ icsInfo[code].description }}</div>
                </q-card>
              </q-menu>
            </span>
            <span v-if="i < (row.ics_codes ?? []).length - 1">, </span>
          </template>
        </div>
      </div>
      <div>
        <div class="text-caption text-grey">Webstore URL</div>
        <div class="text-body2">{{ row.webstore_url || '—' }}</div>
      </div>
      <div>
        <div class="text-caption text-grey">Last Reviewed</div>
        <div class="text-body2">{{ row.last_reviewed_date || '—' }}</div>
      </div>
      <div>
        <div class="text-caption text-grey">Reviewed By</div>
        <div class="text-body2">{{ row.last_reviewed_by || '—' }}</div>
      </div>
    </div>
    <q-btn flat dense color="primary" icon="edit" label="Edit" @click="emit('start-edit')" />
  </div>
  <div v-else class="q-pa-md bg-grey-1">
    <q-form @submit="handleSubmit" class="q-gutter-sm">
      <q-input
        filled
        dense
        v-model="form.number"
        label="Standard Number *"
        lazy-rules
        :rules="[(v: string) => !!v || 'Cannot be blank']"
      />
      <q-input
        filled
        dense
        type="textarea"
        rows="2"
        v-model="form.title"
        label="Title *"
        lazy-rules
        :rules="[(v: string) => !!v || 'Cannot be blank']"
      />
      <q-input
        filled
        dense
        v-model="form.ics_codes"
        label="ICS Codes"
        hint="Comma-separated, e.g. 29.120.40, 97.100.20"
      />
      <q-input
        filled
        dense
        type="url"
        v-model="form.webstore_url"
        label="Webstore URL"
        hint="Link to the standard's webstore page"
      />
      <div class="row q-gutter-sm">
        <q-input
          class="col"
          filled
          dense
          v-model="form.last_reviewed_date"
          mask="date"
          label="Last Reviewed Date (yyyy/mm/dd)"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="form.last_reviewed_date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input class="col" filled dense v-model="form.last_reviewed_by" label="Reviewed By" />
      </div>
      <div class="row justify-end q-gutter-sm q-pt-xs">
        <q-btn flat label="Cancel" @click="emit('cancel-edit')" />
        <q-btn color="teal" label="Save" type="submit" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Standard } from './models';
import type { StandardWithLatestRevision } from 'src/stores/standard-store';

const props = defineProps<{
  row: StandardWithLatestRevision;
  isEditing: boolean;
  clickTooltips?: boolean;
}>();

const emit = defineEmits<{
  'start-edit': [];
  'cancel-edit': [];
  save: [updated: Standard];
}>();

interface IcsInfo {
  description: string;
}

const icsInfo = ref<Record<string, IcsInfo>>({});

async function loadIcsInfo(codes: string[]) {
  for (const code of codes) {
    if (icsInfo.value[code]) continue;
    try {
      const res = await fetch(`/ics/ed7/${code.replace(/\./g, '_')}.json`);
      if (res.ok) {
        const data = await res.json();
        icsInfo.value[code] = { description: data.description };
      }
    } catch {
      // file not found or network error — tooltip simply won't show
    }
  }
}

watch(
  () => props.row.ics_codes,
  (codes) => {
    if (codes && codes.length) void loadIcsInfo(codes);
  },
  { immediate: true },
);

const form = ref({
  number: '',
  title: '',
  ics_codes: '',
  webstore_url: '',
  last_reviewed_date: '',
  last_reviewed_by: '',
});

watch(
  () => props.isEditing,
  (val) => {
    if (val) {
      form.value = {
        number: props.row.number,
        title: props.row.title,
        ics_codes: (props.row.ics_codes ?? []).join(', '),
        webstore_url: props.row.webstore_url ?? '',
        last_reviewed_date: props.row.last_reviewed_date ?? '',
        last_reviewed_by: props.row.last_reviewed_by ?? '',
      };
    }
  },
);

function handleSubmit() {
  emit('save', {
    id: props.row.id,
    number: form.value.number,
    title: form.value.title,
    ics_codes: form.value.ics_codes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    webstore_url: form.value.webstore_url || null,
    last_reviewed_date: form.value.last_reviewed_date || null,
    last_reviewed_by: form.value.last_reviewed_by || null,
  });
}
</script>
