<template>
  <q-card bordered>
    <q-list separator>
      <q-item header class="bg-cyan-1">
        <q-item-label>
          <div class="text-h6">Company Information</div>
          <div class="text-caption">
            Official use for contracts and certificates -- may be different than company info
            presented elsewhere
          </div>
        </q-item-label>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Company Name</q-item-label>
          <!-- This should be the customer name from the CertificationCustomer model. Take out the N/A once that data gets populated correctly -->
          <q-item-label class="q-pl-md">{{ customer.name || 'N/A' }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Address</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Phone Number</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Website</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline>Primary Contact</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <q-card bordered class="q-mt-md">
    <q-list separator>
      <q-item header class="bg-cyan-1">
        <q-item-label>
          <div class="text-h6">Approved Listings</div>
        </q-item-label>
      </q-item>
      <q-card bordered class="q-ma-xs">
        <q-list separator>
          <!-- Maybe put little buttons for showing/adding notes and documents to the right of this row? If so, remove the sections below -->
          <q-item-label class="bg-grey-3 q-pa-sm">
            <div class="text-bold">(Product Category)</div>
          </q-item-label>
          <div class="row">
            <div class="col-10">
              <q-item>
                <q-item-section>
                  <q-item-label overline>Standards</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Product Description</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Model Numbers</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label overline>Listing Conditions</q-item-label>
                </q-item-section>
              </q-item>
              <!-- Only if there are any notes. Transform from array to unordered list for display, the reverse for data storage -->
              <q-item>
                <q-item-section>
                  <q-item-label overline>Notes</q-item-label>
                </q-item-section>
              </q-item>
              <!-- Only if there are any documents, although we still need a button to add some regardless -->
              <q-item>
                <q-item-section>
                  <q-item-label overline>Documents</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col">
              <q-item>
                <q-item-section>
                  <q-item-label overline>Certification Mark</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-list>
      </q-card>
    </q-list>
  </q-card>

  <q-card bordered class="q-mt-md">
    <q-list separator>
      <q-item header class="bg-cyan-1">
        <q-item-label>
          <div class="text-h6">Approved Manufacturing Facilities</div>
        </q-item-label>
      </q-item>
      <q-card bordered class="q-ma-xs">
        <q-list separator>
          <!-- Maybe put little buttons for showing/adding notes and documents to the right of this row? If so, remove the sections below -->
          <q-item-label class="bg-grey-3 q-pa-sm">
            <div class="text-bold">(Facility Name)</div>
          </q-item-label>
          <q-item>
            <q-item-section>
              <q-item-label overline>Address</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-list>
  </q-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Customer } from '../Customers/models';

const props = defineProps<{
  customer: Customer;
}>();

const customer = ref(props.customer || {});
</script>
