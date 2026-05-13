<template>
  <q-card bordered :class="archived ? 'q-ma-xs' : 'q-ma-sm'">
    <q-toolbar class="bg-grey-3">
      <div :class="['text-bold', { 'text-grey-7': archived }]">{{ listing.displayLabel }}</div>
      <q-space />
      <template v-if="archived">
        <q-badge color="grey-6" label="Archived" class="q-mr-sm" />
      </template>
      <template v-else>
        <q-btn round flat color="primary" icon="edit_note" @click="$emit('openNotes')">
          <q-tooltip>Edit Notes</q-tooltip>
        </q-btn>
        <q-btn round flat color="primary" icon="file_present">
          <q-tooltip>Documents</q-tooltip>
        </q-btn>
      </template>
    </q-toolbar>
    <div class="row">
      <div class="col-xs-12 col-md-10">
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>Standards</q-item-label>
              <div class="q-pl-md q-mt-xs">
                <template v-if="listing.standardRevisionsApproved.length">
                  <div v-for="(std, i) in [...listing.standardRevisionsApproved].sort()" :key="i">
                    <strong>{{ std.split(' – ')[0] }}</strong>
                    <template v-if="std.includes(' – ')">
                      – {{ std.split(' – ').slice(1).join(' – ') }}</template
                    >
                  </div>
                </template>
                <template v-else>N/A</template>
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Product Description</q-item-label>
              <q-item-label class="q-pl-md">{{ listing.description }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline>Model Numbers</q-item-label>
              <div class="q-pl-md q-pt-xs q-pb-xs q-gutter-xs">
                <template v-if="listing.models.length">
                  <q-chip
                    v-for="model in [...listing.models].sort((a, b) => a.modelNumber.localeCompare(b.modelNumber, undefined, { numeric: true }))"
                    :key="model.id"
                    :clickable="!archived"
                    outline
                    :color="archived ? 'grey-5' : !model.documents?.length ? 'red-6' : 'primary'"
                    dense
                    @click="!archived && openModelDialog(model)"
                  >
                    {{ model.modelNumber }}
                    <q-tooltip>
                      <div v-if="model.description">{{ model.description }}</div>
                      <div class="text-caption">
                        {{ model.documents?.length
                          ? `${model.documents.length} document${model.documents.length === 1 ? '' : 's'}`
                          : 'No documents' }}
                      </div>
                    </q-tooltip>
                  </q-chip>
                </template>
                <span v-else class="text-grey-6">N/A</span>
              </div>
            </q-item-section>
          </q-item>
          <q-item v-if="listing.listingConditions.length">
            <q-item-section>
              <q-item-label overline>Listing Conditions</q-item-label>
              <ol class="q-pl-lg q-mt-xs q-mb-xs">
                <li v-for="(condition, i) in listing.listingConditions" :key="i">
                  {{ condition }}
                </li>
              </ol>
            </q-item-section>
          </q-item>
          <q-item v-if="listing.notes?.length">
            <q-item-section>
              <q-item-label overline>Notes</q-item-label>
              <ul class="q-pl-lg q-mt-xs q-mb-xs">
                <li v-for="(note, i) in listing.notes" :key="i">{{ note }}</li>
              </ul>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-separator />
      <div class="col-xs-12 col-md-2">
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>Certification Mark</q-item-label>
              <div class="column items-center q-mt-xs">
                <div class="cert-mark-wrapper">
                  <img :src="`/${schemeCode}.png`" class="cert-mark-img" />
                  <template v-if="listing.hasCanada">
                    <span class="cert-mark-c">C</span>
                    <span class="cert-mark-us">US</span>
                  </template>
                </div>
                <div class="cert-mark-listing-number">
                  {{ listingNumber }}
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-card>

  <CertificationModelDialog
    v-if="activeModel"
    v-model="modelDialogOpen"
    :model="activeModel"
  />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { CertificationListingDetail, CertificationModel } from './models';
import CertificationModelDialog from './CertificationModelDialog.vue';

const props = defineProps<{
  listing: CertificationListingDetail;
  listingNumber: string;
  archived?: boolean;
}>();

defineEmits<{
  openNotes: [];
}>();

const schemeCode = computed(() => props.listing.displayLabel.split(' ')[0] ?? 'General');

const activeModel = ref<CertificationModel | null>(null);
const modelDialogOpen = ref(false);

function openModelDialog(model: CertificationModel) {
  activeModel.value = model;
  modelDialogOpen.value = true;
}
</script>

<style scoped>
.cert-mark-wrapper {
  position: relative;
  display: inline-block;
}
.cert-mark-img {
  width: 100px;
  display: block;
}
.cert-mark-listing-number {
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  color: #0000ff;
}
.cert-mark-c,
.cert-mark-us {
  position: absolute;
  bottom: 4px;
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
  color: #0000ff;
}
.cert-mark-c {
  left: -16px;
}
.cert-mark-us {
  right: -24px;
}
</style>
