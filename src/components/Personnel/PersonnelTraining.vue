<template>
  <div>
    <q-list separator>
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6">Training Record</q-item-label>
          <q-item-label caption
            >If a record has an attached file, click the icon to view it.</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-btn
            rounded
            color="green"
            icon="add_box"
            label="Add New"
            @click="newFormVisible = true"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="newFormVisible">
        <q-card bordered style="width: 100%" class="q-pa-sm">
          <q-form @submit="submitTrainingRecord" class="q-gutter-sm">
            <q-input
              filled
              v-model="newRecord.date"
              mask="date"
              label="Date of Training (yyyy/mm/dd)"
              :rules="[(val) => !!val || 'Cannot be blank']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="newRecord.date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              filled
              v-model="newRecord.description"
              label="Description of Training"
              :rules="[(val) => !!val || 'Cannot be blank']"
            />

            <div class="row items-center q-gutter-sm q-pa-sm">
              <q-icon name="attach_file" size="sm" :color="pendingFile ? 'teal' : 'grey'" />
              <div class="col">
                <div class="text-body2">
                  {{ pendingFile ? pendingFile.name : 'No file attached (optional)' }}
                </div>
                <div class="text-caption text-grey">PDF, PNG, or JPG</div>
              </div>
              <q-btn outline color="primary" label="Attach File" @click="fileInputRef?.click()" />
            </div>

            <q-card-actions>
              <q-btn label="Add Record" type="submit" color="teal" :loading="addingRecord" />
              <q-btn label="Cancel" flat class="q-ml-sm" @click="cancelNewRecord" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-item>

      <q-item v-for="record in store.trainingRecords" :key="record.id">
        <q-item-section>
          <q-item-label overline>{{ record.date }}</q-item-label>
          <q-item-label>{{ record.description }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="record.url">
          <q-btn flat round color="red" icon="picture_as_pdf" @click="viewFile(record.url)">
            <q-tooltip>View Document</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side v-else-if="record.file">
          <q-btn flat round color="grey" icon="picture_as_pdf" disable>
            <q-tooltip>File not available — please re-upload</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>

      <q-item v-if="store.trainingRecords.length === 0">
        <q-item-section class="text-grey text-italic">No training records on file.</q-item-section>
      </q-item>
    </q-list>

    <input
      ref="fileInputRef"
      type="file"
      accept=".pdf,.png,.jpg,.jpeg"
      style="display: none"
      @change="onFileSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePersonnelStore } from 'src/stores/personnel-store';
import type { Employee } from './models';

const props = defineProps<{ employee: Employee }>();

const store = usePersonnelStore();

const newFormVisible = ref(false);
const addingRecord = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const pendingFile = ref<File | null>(null);

const newRecord = ref({ date: '', description: '' });

const viewFile = (url: string | null) => {
  if (url) window.open(url, '_blank');
};

const onFileSelected = (e: Event) => {
  pendingFile.value = (e.target as HTMLInputElement).files?.[0] ?? null;
};

const cancelNewRecord = () => {
  newFormVisible.value = false;
  newRecord.value = { date: '', description: '' };
  pendingFile.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const submitTrainingRecord = async () => {
  addingRecord.value = true;
  const url = pendingFile.value ? URL.createObjectURL(pendingFile.value) : null;
  await store.addTraining({
    employeeId: props.employee.id,
    date: newRecord.value.date,
    description: newRecord.value.description,
    file: pendingFile.value?.name ?? null,
    url,
  });
  addingRecord.value = false;
  cancelNewRecord();
};

onMounted(async () => {
  await store.fetchTraining(props.employee.id);
});
</script>
