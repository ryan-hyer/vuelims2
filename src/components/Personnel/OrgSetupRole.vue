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
          <q-item-label overline>Supervisor:</q-item-label>
          <q-select
            dense
            filled
            hide-bottom-space
            v-model="role.supervisor"
            :options="supervisors"
            emit-value
            map-options
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
          <q-input type="textarea" dense filled v-model="keyDutiesText" hint="One item per line" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Authorizations:</q-item-label>
          <q-input
            type="textarea"
            dense
            filled
            v-model="authorizationsText"
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
            v-model="hiringQualificationsText"
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
            v-model="probationTargetsText"
            hint="One item per line"
          />
        </q-item-section>
      </q-item>

      <q-card-actions>
        <q-btn label="Submit" type="submit" color="teal" />
        <q-btn label="Cancel" flat class="q-ml-sm" @click="cancelForm" />
        <q-space />
        <q-btn v-if="!isNew" color="red" label="Delete Role" @click="deleteRole" />
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
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Role } from './models';
import { usePersonnelStore } from 'src/stores/personnel-store';
const store = usePersonnelStore();

const props = defineProps({
  role: {
    type: Object as () => Role,
    required: false,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  close: [];
  update: [role: Role];
  delete: [roleId: number];
}>();

const role = ref<Role>(
  props.role || {
    id: Date.now(),
    title: '',
    supervisor: 0,
    roleDescription: '',
    keyDuties: [],
    authorizations: [],
    hiringQualifications: [],
    probationTargets: [],
  },
);

const supervisors = ref<{ label: string; value: number }[]>([]);

const formIsVisible = ref(props.isNew);

const toText = (arr: string[]) => arr.join('\n');
const toArray = (text: string) => text.split('\n').filter((s) => s.trim() !== '');

const keyDutiesText = computed({
  get: () => toText(role.value.keyDuties),
  set: (val) => {
    role.value.keyDuties = toArray(val);
  },
});
const authorizationsText = computed({
  get: () => toText(role.value.authorizations),
  set: (val) => {
    role.value.authorizations = toArray(val);
  },
});
const hiringQualificationsText = computed({
  get: () => toText(role.value.hiringQualifications),
  set: (val) => {
    role.value.hiringQualifications = toArray(val);
  },
});
const probationTargetsText = computed({
  get: () => toText(role.value.probationTargets),
  set: (val) => {
    role.value.probationTargets = toArray(val);
  },
});

const submitForm = () => {
  emit('update', { ...role.value });
  formIsVisible.value = false;
};

const deleteRole = () => {
  if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
    emit('delete', role.value.id);
  }
};

const cancelForm = () => {
  if (props.isNew) {
    emit('close');
  } else {
    formIsVisible.value = false;
  }
};

onMounted(async () => {
  if (store.allRoles.length === 0) await store.fetchOrg();
  supervisors.value = store.allRoles
    .filter((r) => r.id !== role.value.id)
    .map((r) => ({ label: r.title, value: r.id }));
});
</script>
