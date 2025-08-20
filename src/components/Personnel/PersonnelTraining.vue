<template>
  <q-tab-panel name="training">
    <q-card bordered class="q-mb-md">
      <q-list separator>
        <q-item class="text-h6"> Listing Compliance Engineer </q-item>
        <q-expansion-item expand-icon-toggle expand-separator>
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon
                color="green"
                name="check_circle"
                size="lg"
                v-if="employee.qualificationsVerifiedDate"
              />
              <q-icon color="orange" name="warning" size="lg" v-else />
            </q-item-section>
            <q-item-section>
              <q-item-label>Hiring Qualifications</q-item-label>
              <q-item-label caption>Expand to view details</q-item-label>
              <q-item-label caption v-if="employee.qualificationsVerifiedDate">
                Verified {{ employee.qualificationsVerifiedDate }} by
                {{ employee.qualificationsVerifiedBy }}
              </q-item-label>
              <q-item-label caption v-else>
                <span class="text-red">Not Yet Verified!</span>
                <q-btn
                  label="Verify Now"
                  size="xs"
                  color="primary"
                  class="q-ml-sm"
                  @click="dialogHiringVerification = true"
                />
              </q-item-label>
            </q-item-section>
          </template>
          <q-card bordered>
            <q-card-section>{{ hiringQualifications }}</q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-icon-toggle expand-separator>
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon
                color="green"
                name="check_circle"
                size="lg"
                v-if="employee.probationVerifiedDate"
              />
              <q-icon color="orange" name="warning" size="lg" v-else />
            </q-item-section>

            <q-item-section>
              <q-item-label>90-Day Probation Targets</q-item-label>
              <q-item-label caption>Expand to view details</q-item-label>
              <q-item-label caption v-if="employee.probationVerifiedDate">
                Verified {{ employee.probationVerifiedDate }} by
                {{ employee.probationVerifiedBy }}
              </q-item-label>
              <q-item-label caption v-else>
                <span class="text-red">Not Yet Verified!</span>
                <q-btn
                  label="Verify Now"
                  size="xs"
                  color="primary"
                  class="q-ml-sm"
                  @click="dialogProbationVerification = true"
                />
              </q-item-label>
            </q-item-section>
          </template>
          <q-card bordered>
            <q-card-section>{{ probationCompetencies }}</q-card-section>
          </q-card>
        </q-expansion-item>
        <q-item>
          <q-item-section>
            <q-item-label overline>Ongoing Training Areas</q-item-label>
            <q-item-label>{{ trainingAreas }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <q-separator size="5px" />
    <q-list separator>
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6">Training Record</q-item-label>
          <q-item-label caption> If record has an attached file, click icon to view </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            rounded
            color="green"
            icon="add_box"
            label="Add New"
            @click="newTrainingRecordFormIsVisible = true"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="newTrainingRecordFormIsVisible">
        <q-card bordered style="width: 100%" class="q-pa-sm">
          <q-form @submit="submitForm" class="q-gutter-sm">
            <q-input
              filled
              v-model="newTrainingRecord.date"
              mask="date"
              label="Date of Training (yyyy/mm/dd)"
              :rules="[(val) => !!val || 'Cannot be blank']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="newTrainingRecord.date">
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
              v-model="newTrainingRecord.description"
              label="Description of Training"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Cannot be blank']"
            />

            <q-field
              filled
              label="Areas Covered by This Training"
              stack-label
              style="padding-bottom: 20px"
              color="black"
            >
              <q-option-group
                v-model="newTrainingRecord.areas"
                :options="allTrainingAreas"
                type="checkbox"
              />
            </q-field>

            <q-field
              filled
              label="Upload Certificate or Other Documentation (optional)"
              stack-label
              style="padding-bottom: 20px"
            >
              <template v-slot:control>
                <q-uploader
                  flat
                  bordered
                  auto-upload
                  label="Select a PDF file to upload"
                  accept="application/pdf"
                  url="http://localhost:4444/upload"
                  style="width: 100%"
                />
              </template>
            </q-field>

            <q-card-actions>
              <q-btn label="Add Record" type="submit" color="teal" />
              <q-btn
                label="Cancel"
                flat
                class="q-ml-sm"
                @click="newTrainingRecordFormIsVisible = false"
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-item>
      <q-item v-for="record in trainingRecords" :key="record.id">
        <q-item-section>
          <q-item-label overline>{{ record.date }}</q-item-label>
          <q-item-label>
            {{ record.description }}
          </q-item-label>
          <q-item-label caption>Training areas covered: {{ record.areas }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="record.file">
          <q-btn flat round color="red" icon="fas fa-file-pdf" size="md" />
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="dialogHiringVerification" persistent>
      <q-card style="min-width: 350px">
        <q-item>
          <q-item-section>
            <q-item-label> Record the following for Hiring Qualifications? </q-item-label>
            <q-item-label caption> Verified 9/23/2021 by Alona MacGregor </q-item-label>
          </q-item-section>
        </q-item>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Confirm" v-close-popup @click="verifyQualifications" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogProbationVerification" persistent>
      <q-card style="min-width: 350px">
        <q-item>
          <q-item-section>
            <q-item-label> Record the following for 90-Day Probation? </q-item-label>
            <q-item-label caption> Verified 9/23/2021 by Alona MacGregor </q-item-label>
          </q-item-section>
        </q-item>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Confirm" v-close-popup @click="verifyProbation" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/* const props = defineProps({
  employeeId: { type: Number, required: true },
});
 */
const employee = ref({
  qualificationsVerifiedDate: '',
  qualificationsVerifiedBy: '',
  probationVerifiedDate: '',
  probationVerifiedBy: '',
});

// Real data should be sorted by date descending, newest at top
const trainingRecords = ref([
  {
    id: 1,
    date: '2019/02/17',
    description: 'A2LA Annual Technical Forum',
    areas: '4',
    file: '123.pdf',
  },
  {
    id: 2,
    date: '2019/06/08',
    description: 'ISO 17025 Training Class',
    areas: '1, 2',
    file: '234.pdf',
  },
  {
    id: 3,
    date: '2019/07/02',
    description: 'TEi Staff Meeting',
    areas: '2, 3',
    file: null,
  },
  {
    id: 4,
    date: '2019/10/12',
    description: 'RVIA Subcommittee Meetings',
    areas: '3',
    file: null,
  },
  {
    id: 5,
    date: '2020/01/29',
    description: 'ABYC Technical Committees',
    areas: '2, 4',
    file: '345.pdf',
  },
]);

const hiringQualifications =
  '<ul><li>Education/Experience – The following, or a demonstrated equivalent combination:</li><ul><li>A four-year college or university degree in an Engineering field</li><li>Five years of engineering experience</li><li>Two years of standards development or standards compliance experience</li></ul></li><li>Physical Requirements – Must possess mobility to work in a standard office setting and to use standard office equipment, including a computer, and to attend meetings at various sites within and away from the company; strength to lift and carry materials weighing up to 20 pounds; vision to read printed materials and a computer screen; and hearing and speech to communicate in person and over the telephone.</li></ul>';
const probationCompetencies =
  '<ul><li>Understanding of the TEi Quality Management System</li><li>Understanding of the TEi-LS certification programs, requirements, and procedures</li><li>Understanding of certification body accreditation requirements</li><li>Basic understanding of the standards used in the TEi-LS certification programs</li><li>Successful completion of at least three certification evaluation reviews under the supervision of the TEi-LS Director and TEi Quality Manager</li></ul>';
const trainingAreas =
  '<ol><li>TEi Quality Management System</li><li>TEi-LS certification program and standards</li><li>Recreational vehicles</li><li>Accreditation requirements</li></ol>';

const dialogHiringVerification = ref(false);
const dialogProbationVerification = ref(false);

const verifyQualifications = () => {
  employee.value.qualificationsVerifiedDate = '2021/09/23';
  employee.value.qualificationsVerifiedBy = 'Alona MacGregor';
};

const verifyProbation = () => {
  employee.value.probationVerifiedDate = '2021/09/23';
  employee.value.probationVerifiedBy = 'Alona MacGregor';
};

const newTrainingRecord = ref({
  date: null,
  description: null,
  areas: [],
});

const allTrainingAreas = ref([
  {
    label: 'TEi Quality Management System',
    value: '1',
  },
  {
    label: 'TEi-LS certification program and standards',
    value: '2',
  },
  {
    label: 'Recreational vehicles',
    value: '3',
  },
  {
    label: 'Accreditation requirements',
    value: '4',
  },
]);

const newTrainingRecordFormIsVisible = ref(false);

const submitForm = () => {
  console.log('Form submitted');
  newTrainingRecordFormIsVisible.value = false;
};
</script>
