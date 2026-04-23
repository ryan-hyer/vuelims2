<template>
  <div>
    <!-- New review form -->
    <div v-if="newReviewVisible">
      <div class="text-h6 q-mb-md">New Performance Review</div>
      <q-form @submit="submitReview" class="q-gutter-sm">
        <div class="row q-gutter-md">
          <q-input
            filled
            v-model="newReview.given_date"
            mask="date"
            label="Review Date (yyyy/mm/dd)"
            class="col"
            :rules="[(val) => !!val || 'Required']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="newReview.given_date">
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
            v-model="newReview.given_by"
            label="Review Given By"
            class="col"
            :rules="[(val) => !!val || 'Required']"
          />
        </div>

        <q-item class="bg-grey-3 q-mt-md">
          <q-item-section>
            A. Ask the employee the following questions and note key points of the discussion.
          </q-item-section>
        </q-item>
        <q-input
          filled
          type="textarea"
          v-model="newReview.A1"
          label="1. Has the past year been good/bad/satisfactory or otherwise for you, and why?"
          autogrow
        />
        <q-input
          filled
          type="textarea"
          v-model="newReview.A2"
          label="2. What do you like and dislike about working for this organization?"
          autogrow
        />
        <q-input
          filled
          type="textarea"
          v-model="newReview.A3"
          label="3. What elements of your job do you find most difficult?"
          autogrow
        />
        <q-input
          filled
          type="textarea"
          v-model="newReview.A4"
          label="4. What elements of your job interest you the most and least?"
          autogrow
        />
        <q-input
          filled
          type="textarea"
          v-model="newReview.A5"
          label="5. What actions could be taken to improve your performance in your current position?"
          autogrow
        />
        <q-input
          filled
          type="textarea"
          v-model="newReview.A6"
          label="6. What sort of training or experiences would benefit you in the next year?"
          autogrow
        />

        <q-item class="bg-grey-3 q-mt-md">
          <q-item-section>
            B. Rate the employee in the following areas (1 = poor · 10 = excellent).
          </q-item-section>
        </q-item>
        <div class="row q-col-gutter-md q-pa-sm">
          <div class="col-12 col-sm-6" v-for="field in bFields" :key="field.key">
            <div class="text-caption q-mb-xs">
              {{ field.label }}: <strong>{{ newReview[field.key] }}</strong>
            </div>
            <q-slider v-model="newReview[field.key]" :min="1" :max="10" label markers />
          </div>
        </div>

        <q-item class="bg-grey-3 q-mt-md">
          <q-item-section
            >C. Evaluate the employee's performance of the key duties in their
            role(s).</q-item-section
          >
        </q-item>
        <q-input filled type="textarea" v-model="newReview.C" autogrow />

        <q-item class="bg-grey-3">
          <q-item-section
            >D. Goals from the last review — score performance against each
            objective.</q-item-section
          >
        </q-item>
        <q-input filled type="textarea" v-model="newReview.D" autogrow />

        <q-item class="bg-grey-3">
          <q-item-section
            >E. Training received since last review vs. core competencies — note any
            gaps.</q-item-section
          >
        </q-item>
        <q-input filled type="textarea" v-model="newReview.E" autogrow />

        <q-item class="bg-grey-3">
          <q-item-section>F. Agree upon specific goals for the next year.</q-item-section>
        </q-item>
        <q-input filled type="textarea" v-model="newReview.F" autogrow />

        <q-item class="bg-grey-3">
          <q-item-section
            >G. Declare any new associations or memberships that may present a conflict of
            interest.</q-item-section
          >
        </q-item>
        <q-input filled type="textarea" v-model="newReview.G" autogrow />

        <q-item class="bg-grey-3">
          <q-item-section>H. Other comments / issues / discussion points.</q-item-section>
        </q-item>
        <q-input filled type="textarea" v-model="newReview.H" autogrow />

        <q-item class="bg-grey-3">
          <q-item-section
            >I. Final assessment of employee; recommendations or actions if any.</q-item-section
          >
        </q-item>
        <q-input filled type="textarea" v-model="newReview.I" autogrow />

        <q-input
          filled
          v-model="newReview.employee_signed_date"
          mask="date"
          label="Employee Sign-off Date (yyyy/mm/dd — leave blank if not yet signed)"
          class="q-mt-md"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="newReview.employee_signed_date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-card-actions>
          <q-btn label="Submit Review" type="submit" color="teal" :loading="submitting" />
          <q-btn label="Cancel" flat class="q-ml-sm" @click="cancelNewReview" />
        </q-card-actions>
      </q-form>
    </div>

    <!-- Review list -->
    <div v-else>
      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Performance Reviews</q-item-label>
            <q-item-label caption>Expand a record to view all details.</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              rounded
              color="green"
              icon="add_box"
              label="Begin New Review"
              class="q-mb-md"
              @click="newReviewVisible = true"
            />
          </q-item-section>
        </q-item>

        <q-expansion-item
          expand-separator
          group="reviews"
          v-for="review in store.reviews"
          :key="review.id"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label>Review Date: {{ review.given_date }}</q-item-label>
              <q-item-label caption>Given By: {{ review.given_by }}</q-item-label>
            </q-item-section>
          </template>
          <q-card bordered class="q-mb-lg">
            <q-list dense>
              <template v-if="review.A1">
                <q-item class="bg-grey-3">
                  <q-item-section>A. Employee Discussion</q-item-section>
                </q-item>
                <q-item v-for="(label, i) in aLabels" :key="i">
                  <q-item-section>
                    <q-item-label overline>{{ i + 1 }}. {{ label }}</q-item-label>
                    <q-item-label class="q-pl-md">{{
                      review[`A${i + 1}` as keyof typeof review]
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <template v-if="review.B1 !== null">
                <q-item class="bg-grey-3 q-mt-sm">
                  <q-item-section>B. Ratings (1–10)</q-item-section>
                </q-item>
                <q-item>
                  <div class="row q-gutter-md q-pa-sm">
                    <div v-for="field in bFields" :key="field.key" style="min-width: 220px">
                      {{ field.label }}:
                      <strong>{{ review[field.key as keyof typeof review] ?? '—' }}</strong>
                    </div>
                  </div>
                </q-item>
              </template>

              <template v-for="(label, key) in cToI" :key="key">
                <q-item class="bg-grey-3 q-mt-sm" v-if="review[key as keyof typeof review]">
                  <q-item-section>{{ label }}</q-item-section>
                </q-item>
                <q-item class="q-ml-md" v-if="review[key as keyof typeof review]">
                  {{ review[key as keyof typeof review] }}
                </q-item>
              </template>

              <q-item class="bg-grey-3 text-weight-bold q-mt-sm" v-if="review.employee_signed_date">
                <q-item-section>
                  Employee signed: {{ review.employee_signed_date }}
                </q-item-section>
              </q-item>
              <q-item v-if="!review.A1 && review.B1 === null && !review.C">
                <q-item-section class="text-grey text-italic">
                  Detailed responses not available for this review.
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-expansion-item>
        <q-item v-if="store.reviews.length === 0">
          <q-item-section class="text-grey text-italic">No reviews on file.</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePersonnelStore } from 'src/stores/personnel-store';
import type { Employee } from './models';

const props = defineProps<{ employee: Employee }>();

const store = usePersonnelStore();
const newReviewVisible = ref(false);
const submitting = ref(false);

const aLabels = [
  'Has the past year been good/bad/satisfactory or otherwise for you, and why?',
  'What do you like and dislike about working for this organization?',
  'What elements of your job do you find most difficult?',
  'What elements of your job interest you the most and least?',
  'What actions could be taken to improve your performance in your current position?',
  'What sort of training or experiences would benefit you in the next year?',
];

const bFields = [
  { key: 'B1', label: 'Technical knowledge' },
  { key: 'B2', label: 'Time management' },
  { key: 'B3', label: 'Communication skills' },
  { key: 'B4', label: 'Interpersonal relationships' },
  { key: 'B5', label: 'Adaptability / Initiative' },
  { key: 'B6', label: 'Leadership' },
  { key: 'B7', label: 'Steadiness under pressure' },
  { key: 'B8', label: 'Corporate responsibility and ethics' },
  { key: 'B9', label: 'Creativity' },
  { key: 'B10', label: 'Problem solving and decision making' },
  { key: 'B11', label: 'Work habits' },
  { key: 'B12', label: 'Teamwork' },
  { key: 'B13', label: 'Customer service' },
  { key: 'B14', label: 'Energy, determination, and work rate' },
  { key: 'B15', label: 'Personal appearance and image' },
  { key: 'B16', label: 'Reporting and administration' },
] as const;

const cToI: Record<string, string> = {
  C: 'C. Key duties performance evaluation',
  D: 'D. Goals from last review — performance scores',
  E: 'E. Training received vs. core competency gaps',
  F: 'F. Goals for next year',
  G: 'G. Conflicts of interest declaration',
  H: 'H. Other comments / issues / discussion points',
  I: 'I. Final assessment and recommendations',
};

const makeEmptyReview = () => ({
  given_date: new Date().toISOString().split('T')[0]!.replace(/-/g, '/'),
  given_by: '',
  employee_signed_date: '',
  A1: '',
  A2: '',
  A3: '',
  A4: '',
  A5: '',
  A6: '',
  B1: 5,
  B2: 5,
  B3: 5,
  B4: 5,
  B5: 5,
  B6: 5,
  B7: 5,
  B8: 5,
  B9: 5,
  B10: 5,
  B11: 5,
  B12: 5,
  B13: 5,
  B14: 5,
  B15: 5,
  B16: 5,
  C: '',
  D: '',
  E: '',
  F: '',
  G: '',
  H: '',
  I: '',
});

const newReview = ref(makeEmptyReview());

const cancelNewReview = () => {
  newReviewVisible.value = false;
  newReview.value = makeEmptyReview();
};

const submitReview = async () => {
  submitting.value = true;
  await store.addReview({
    employeeId: props.employee.id,
    given_date: newReview.value.given_date,
    given_by: newReview.value.given_by,
    employee_signed_date: newReview.value.employee_signed_date || null,
    A1: newReview.value.A1 || null,
    A2: newReview.value.A2 || null,
    A3: newReview.value.A3 || null,
    A4: newReview.value.A4 || null,
    A5: newReview.value.A5 || null,
    A6: newReview.value.A6 || null,
    B1: newReview.value.B1,
    B2: newReview.value.B2,
    B3: newReview.value.B3,
    B4: newReview.value.B4,
    B5: newReview.value.B5,
    B6: newReview.value.B6,
    B7: newReview.value.B7,
    B8: newReview.value.B8,
    B9: newReview.value.B9,
    B10: newReview.value.B10,
    B11: newReview.value.B11,
    B12: newReview.value.B12,
    B13: newReview.value.B13,
    B14: newReview.value.B14,
    B15: newReview.value.B15,
    B16: newReview.value.B16,
    C: newReview.value.C || null,
    D: newReview.value.D || null,
    E: newReview.value.E || null,
    F: newReview.value.F || null,
    G: newReview.value.G || null,
    H: newReview.value.H || null,
    I: newReview.value.I || null,
  });
  submitting.value = false;
  cancelNewReview();
};

onMounted(async () => {
  await store.fetchReviews(props.employee.id);
});
</script>
