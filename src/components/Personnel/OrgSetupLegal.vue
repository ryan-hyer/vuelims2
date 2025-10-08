<template>
  <q-page padding>
    <div class="page-header">Legal Documents</div>
    <q-list bordered separator>
      <q-item class="bg-grey-3">
        <q-item-section>
          <q-item-label class="text-h6">Evidence of Legal Entity</q-item-label>
          <q-item-label caption>(e.g. Articles of Incorporation)</q-item-label>
          <q-item-label caption>Last Uploaded: 3/14/2006</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn round icon="picture_as_pdf" color="red" @click="viewDoc('legal-20060314.pdf')">
            <q-tooltip>View Document</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side>
          <q-btn round icon="upload_file" color="green" @click="legalUpload = true">
            <q-tooltip>Upload New</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item v-if="legalUpload">
        <q-card flat>
          <q-field filled>
            <template v-slot:control>
              <q-uploader
                flat
                bordered
                multiple
                label="Select file(s) for upload, press Upload when ready"
                url="http://localhost:4444/upload"
                style="width: 100%"
              />
            </template>
          </q-field>
          <q-btn flat color="red" label="Cancel" @click="legalUpload = false"></q-btn>
        </q-card>
      </q-item>
      <q-item class="bg-grey-3">
        <q-item-section>
          <q-item-label class="text-h6">Evidence of Financial Stability</q-item-label>
          <q-item-label caption>(e.g. Profit & Loss Statement)</q-item-label>
          <q-item-label caption class="text-red">Last Uploaded: NEVER!</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn round icon="picture_as_pdf" color="red" disable>
            <q-tooltip>No Document Uploaded!</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side>
          <q-btn round icon="upload_file" color="green" @click="financialUpload = true">
            <q-tooltip>Upload New</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item v-if="financialUpload">
        <q-card flat>
          <q-field filled>
            <template v-slot:control>
              <q-uploader
                flat
                bordered
                multiple
                label="Select file(s) for upload, press Upload when ready"
                url="http://localhost:4444/upload"
                style="width: 100%"
              />
            </template>
          </q-field>
          <q-btn flat color="red" label="Cancel" @click="financialUpload = false"></q-btn>
        </q-card>
      </q-item>
      <q-item class="bg-grey-3">
        <q-item-section>
          <q-item-label class="text-h6">Evidence of Liability Insurance</q-item-label>
          <q-item-label caption>(e.g. Insurance Certificate)</q-item-label>
          <q-item-label caption class="text-red">Last Uploaded: NEVER!</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn round icon="picture_as_pdf" color="red" disable>
            <q-tooltip>No Document Uploaded!</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side>
          <q-btn round icon="upload_file" color="green" @click="insuranceUpload = true">
            <q-tooltip>Upload New</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item v-if="insuranceUpload">
        <q-card flat>
          <q-field filled>
            <template v-slot:control>
              <q-uploader
                flat
                bordered
                multiple
                label="Select file(s) for upload, press Upload when ready"
                url="http://localhost:4444/upload"
                style="width: 100%"
              />
            </template>
          </q-field>
          <q-btn flat color="red" label="Cancel" @click="insuranceUpload = false"></q-btn>
        </q-card>
      </q-item>
      <q-item class="bg-grey-3">
        <q-item-section>
          <q-item-label class="text-h6">Evidence of Certification Mark Protection</q-item-label>
          <q-item-label caption>(e.g. Trademark Registration)</q-item-label>
          <q-item-label caption class="text-red">Last Uploaded: NEVER!</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn round icon="picture_as_pdf" color="red" disable>
            <q-tooltip>No Document Uploaded!</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side>
          <q-btn round icon="upload_file" color="green" @click="trademarkUpload = true">
            <q-tooltip>Upload New</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item v-if="trademarkUpload">
        <q-card flat>
          <q-field filled>
            <template v-slot:control>
              <q-uploader
                flat
                bordered
                multiple
                label="Select file(s) for upload, press Upload when ready"
                url="http://localhost:4444/upload"
                style="width: 100%"
              />
            </template>
          </q-field>
          <q-btn flat color="red" label="Cancel" @click="trademarkUpload = false"></q-btn>
        </q-card>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
/*
TODO:
This is fine for now, but it would be even better if each section could contain a list of uploads, sorted by most recent first. Unnecessary, but would be nice.
Finish this up as soon as I learn how to upload/view attachments
*/
import { ref } from 'vue';

const legalUpload = ref(false);
const financialUpload = ref(false);
const insuranceUpload = ref(false);
const trademarkUpload = ref(false);

const viewDoc = (filename: string) => {
  alert('Nothing to see yet, but it works!');
  console.log(filename);
};
</script>
