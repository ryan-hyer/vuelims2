<template>
  <q-tab-panel name="reviews">
    <q-btn rounded color="green" icon="add_box" label="Begin New Review" class="q-mb-md" />
    <q-separator size="5px" />
    <q-list separator>
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6">Past Reviews</q-item-label>
          <q-item-label caption> Click a record to view all details </q-item-label>
        </q-item-section>
      </q-item>
      <q-expansion-item expand-separator group="reviews" v-for="review in reviews" :key="review.id">
        <template v-slot:header>
          <q-item-section>
            <q-item-label>Review Date: {{ review.review_given_date }}</q-item-label>
            <q-item-label caption>Given By: {{ review.reviewed_by }}</q-item-label>
          </q-item-section>
        </template>
        <q-card bordered class="q-mb-lg">
          <q-list dense>
            <q-item class="bg-grey-3">
              A. Ask the employee the following questions, and discuss their responses. Note key
              points of the discussion below.
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>
                  1. Has the past year been good/bad/satisfactory or otherwise for you, and why?
                </q-item-label>
                <q-item-label class="q-pl-md">{{ review.A1 }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>
                  2. What do you like and dislike about working for this organization?
                </q-item-label>
                <q-item-label class="q-pl-md">{{ review.A2 }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>
                  3. What elements of your job do you find most difficult?
                </q-item-label>
                <q-item-label class="q-pl-md">{{ review.A3 }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>
                  4. What elements of your job interest you the most and least?
                </q-item-label>
                <q-item-label class="q-pl-md">{{ review.A4 }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>
                  5. What actions could be taken to improve your performance in your current
                  position by you, and by your boss?
                </q-item-label>
                <q-item-label class="q-pl-md">{{ review.A5 }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>
                  6. What sort of training/experiences would benefit you in the next year? (Not just
                  job skills - also your natural strengths and personal passions you’d like to
                  develop - you and your work can benefit from these.)
                </q-item-label>
                <q-item-label class="q-pl-md">{{ review.A6 }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="bg-grey-3 q-mt-md">
              B. Rate the employee in the following areas (1-3 = poor, 4-6 = satisfactory, 7-9 =
              good, 10 = excellent).
            </q-item>
            <q-item>
              <div class="row">
                <div class="q-pl-md">
                  <div>Technical knowledge: {{ review.B1 }}</div>
                  <div>Time management: {{ review.B2 }}</div>
                  <div>Communication skills: {{ review.B3 }}</div>
                  <div>Interpersonal relationships: {{ review.B4 }}</div>
                  <div>Adaptability / Initiative: {{ review.B5 }}</div>
                  <div>Leadership: {{ review.B6 }}</div>
                  <div>Steadiness under pressure: {{ review.B7 }}</div>
                  <div>Corporate responsibility and ethics: {{ review.B8 }}</div>
                </div>
                <div class="q-pl-md">
                  <div>Creativity: {{ review.B9 }}</div>
                  <div>Problem solving and decision making: {{ review.B10 }}</div>
                  <div>Work habits: {{ review.B11 }}</div>
                  <div>Teamwork: {{ review.B12 }}</div>
                  <div>Customer service: {{ review.B13 }}</div>
                  <div>Energy, determination, and work rate: {{ review.B14 }}</div>
                  <div>Personal appearance and image: {{ review.B15 }}</div>
                  <div>Reporting and administration: {{ review.B16 }}</div>
                </div>
              </div>
            </q-item>
            <q-item class="bg-grey-3 q-mt-md">
              C. Evaluate the employee’s performance of the key duties involved in their position
              (see their Role Description(s) for a list of these).
            </q-item>
            <q-item class="q-ml-md">{{ review.C }}</q-item>
            <q-item class="bg-grey-3">
              D. List the goals the employee set for themselves at their last review. Score their
              performance against each objective (1-3 = poor, 4-6 = satisfactory, 7-9 = good, 10 =
              excellent), and comment where appropriate.
            </q-item>
            <q-item class="q-ml-md">{{ review.D }}</q-item>
            <q-item class="bg-grey-3">
              E. Discuss and record any training the employee has received since their last review,
              and compare with the core competencies found in the employee’s role description(s).
              Note any core competencies that were not adequately covered by training.
            </q-item>
            <q-item class="q-ml-md">{{ review.E }}</q-item>
            <q-item class="bg-grey-3">
              F. Discuss and agree upon specific goals for the next year that will enable the
              employee to reach or improve competence and to meet required performance in their
              current position, and that will enable the employee to achieve their desired personal
              growth or experience.
            </q-item>
            <q-item class="q-ml-md">{{ review.F }}</q-item>
            <q-item class="bg-grey-3">
              G. Ask the employee to declare any new associations, memberships, etc. with any
              individual or organization during the past two years that may present a conflict of
              interest in their current job duties.
            </q-item>
            <q-item class="q-ml-md">{{ review.G }}</q-item>
            <q-item class="bg-grey-3"> H. Other comments / issues / discussion points: </q-item>
            <q-item class="q-ml-md">{{ review.H }}</q-item>
            <q-item class="bg-grey-3">
              I. Final assessment of employee; and recommendations, actions, etc. if any
            </q-item>
            <q-item class="q-ml-md">{{ review.I }}</q-item>
            <q-item class="bg-grey-3 text-weight-bold">
              Employee signed off on review: {{ review.employee_signed_date }}
            </q-item>
          </q-list>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-tab-panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const reviews = ref([
  {
    id: 1,
    review_given_date: '2020/12/17',
    reviewed_by: 'Alona MacGregor',
    A1: 'Good',
    A2: 'Like stuff, dislike stuff',
    A3: 'Some things are hard',
    A4: 'Some things are interesting',
    A5: "Mo' money",
    A6: 'Corporate donut taster training',
    B1: '1',
    B2: '2',
    B3: '3',
    B4: '4',
    B5: '5',
    B6: '6',
    B7: '7',
    B8: '8',
    B9: '9',
    B10: '10',
    B11: '11',
    B12: '12',
    B13: '13',
    B14: '14',
    B15: '15',
    B16: '16',
    C: 'All the duties',
    D: 'Some goal, score: 10 - Great!',
    E: 'Would like to directly display a list of the core competencies along with the number of training records relating to each here',
    F: 'A better list of goals here',
    G: 'None',
    H: 'This employee is really really handsome',
    I: 'Thanks for working for us!',
    employee_signed_date: '2020/12/31',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste eveniet doloribus ullam aliquid.',
  },
  {
    id: 2,
    review_given_date: '2019/12/16',
    reviewed_by: 'Alona MacGregor',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste eveniet doloribus ullam aliquid.',
  },
  {
    id: 3,
    review_given_date: '2018/12/28',
    reviewed_by: 'Alona MacGregor',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste eveniet doloribus ullam aliquid.',
  },
  {
    id: 4,
    review_given_date: '2017/12/04',
    reviewed_by: 'Alona MacGregor',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste eveniet doloribus ullam aliquid.',
  },
]);
</script>
