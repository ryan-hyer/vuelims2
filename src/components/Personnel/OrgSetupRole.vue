<template>
  <q-card class="q-pa-sm">
    <q-bar>
      <q-btn v-if="!formIsVisible" flat icon="edit" label="Edit" @click="formIsVisible = true" />
      <q-space />
      <q-btn flat round color="red" icon="close" @click="$emit('close')" />
    </q-bar>

    <q-form v-if="formIsVisible" @submit="submitForm" style="min-width: 300px">
      <q-item>
        <q-item-section>
          <q-item-label overline>Role Title:</q-item-label>
          <q-input
            dense
            filled
            hide-bottom-space
            v-model="role.title"
            lazy-rules
            :rules="[(val) => !!val || 'Cannot be blank']"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Role Description:</q-item-label>
          <q-input type="textarea" dense filled v-model="role.roleDescription" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Key Duties:</q-item-label>
          <q-input
            type="textarea"
            dense
            filled
            v-model="role.roleDescription"
            hint="One item per line"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Authorizations:</q-item-label>
          <q-input
            type="textarea"
            dense
            filled
            v-model="role.roleDescription"
            hint="One item per line"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Hiring Qualifications:</q-item-label>
          <q-input
            type="textarea"
            dense
            filled
            v-model="role.roleDescription"
            hint="One item per line"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>90-Day Probation Targets:</q-item-label>
          <q-input
            type="textarea"
            dense
            filled
            v-model="role.roleDescription"
            hint="One item per line"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Ongoing Training Focus Areas:</q-item-label>
          <q-input
            type="textarea"
            dense
            filled
            v-model="role.roleDescription"
            hint="One item per line"
          />
        </q-item-section>
      </q-item>

      <q-card-actions>
        <q-btn label="Submit" type="submit" color="teal" />
        <q-btn label="Cancel" flat class="q-ml-sm" @click="formIsVisible = false" />
      </q-card-actions>
    </q-form>

    <q-list separator v-else>
      <q-item>
        <q-item-section>
          <q-item-label class="text-h5">{{ role.title }}</q-item-label>
          <q-item-label>{{ role.roleDescription }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Key Duties:</q-item-label>
          <q-item-label>
            <ul>
              <li v-for="item in role.keyDuties" v-bind:key="item">{{ item }}</li>
            </ul>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Authorizations:</q-item-label>
          <q-item-label>
            <ul>
              <li v-for="item in role.authorizations" v-bind:key="item">{{ item }}</li>
            </ul>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Hiring Qualifications:</q-item-label>
          <q-item-label>
            <ul>
              <li v-for="item in role.hiringQualifications" v-bind:key="item">
                {{ item }}
              </li>
            </ul>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>90-Day Probation Targets:</q-item-label>
          <q-item-label>
            <ul>
              <li v-for="item in role.probationTargets" v-bind:key="item">{{ item }}</li>
            </ul>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Ongoing Training Focus Areas:</q-item-label>
          <q-item-label>
            <ul>
              <li v-for="item in role.trainingFocusAreas" v-bind:key="item">
                {{ item }}
              </li>
            </ul>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
/*
TODO:
It might be better to structure my role model as giant strings with newlines instead of arrays
*/
import { ref } from 'vue';
import type { Role } from './models';

const props = defineProps({
  role: {
    type: Object as () => Role,
    required: false,
  },
});

defineEmits<{
  close: [];
}>();

const role = ref<Role>(
  props.role || {
    id: Date.now(),
    title: '',
    supervisor: -1,
    roleDescription: '',
    keyDuties: [],
    authorizations: [],
    hiringQualifications: [],
    probationTargets: [],
    trainingFocusAreas: [],
  },
);

const formIsVisible = ref(false);

const submitForm = () => {
  // Update the database
  formIsVisible.value = false;
};
</script>
