<template>
  <div>
    <div class="print-hide print-bar">
      <button class="print-btn" @click="doPrint">Print / Save as PDF</button>
    </div>

    <div v-if="loading" class="status-msg">Loading&hellip;</div>
    <div v-else-if="!certCustomer || !approvedListings.length" class="status-msg">
      No approved listings found for this customer.
    </div>

    <div v-else>
      <div
        v-for="(listing, index) in approvedListings"
        :key="listing.id"
        class="page"
        :class="{ 'page-break': index < approvedListings.length - 1 }"
      >
        <!-- HEADER -->
        <header class="doc-header">
          <div class="header-top">
            <img src="/TEi-LS.png" alt="TEi-Listing Services Logo" style="height: 48px" />
            <div class="doc-title">PRODUCT LISTING</div>
          </div>
          <div class="address-bar">
            PO Box 57731 &bull; Salt Lake City, UT 84157-0731 &bull; USA &bull; Phone 801 262 1868
            &bull; Fax 801 262 2363 &bull; www.TEi-LS.com
          </div>
        </header>

        <!-- ISSUED TO -->
        <div class="issued-section">
          <div class="issued-top">
            <span class="issued-label">Issued To:</span>
            <div class="issued-company">
              <div class="company-name">{{ certCustomer.companyName }}</div>
              <div>{{ certCustomer.address1 }}</div>
              <div v-if="certCustomer.address2">{{ certCustomer.address2 }}</div>
              <div>
                {{ certCustomer.city }}, {{ certCustomer.state }} {{ certCustomer.zipCode }}
              </div>
              <div>{{ certCustomer.country }}</div>
              <div v-if="certCustomer.phone">Phone: {{ certCustomer.phone }}</div>
              <div v-if="certCustomer.website">Web: {{ certCustomer.website }}</div>
            </div>
          </div>
          <div class="listing-meta">
            <span
              >Listing Number: <strong>{{ certCustomer.listingNumber }}</strong></span
            >
            <div class="listing-dates">
              <div>
                Listed Since: <strong>{{ isoDate(certCustomer.effectiveDate) }}</strong>
              </div>
              <div>Last Revision: <strong>[Placeholder]</strong></div>
            </div>
          </div>
        </div>

        <!-- LISTING TABLE -->
        <table class="listing-table">
          <tbody>
            <tr class="section-header-row">
              <td colspan="2" class="section-title">{{ listing.displayLabel }}</td>
              <td class="cert-mark-header-cell">Certification Mark:</td>
            </tr>
            <tr>
              <td class="label-cell">Certification<br />Standards:</td>
              <td class="value-cell">
                <div v-for="s in listing.standardRevisionsApproved" :key="s">{{ s }}</div>
                <span v-if="!listing.standardRevisionsApproved.length" class="text-muted"
                  >None listed.</span
                >
              </td>
              <td :rowspan="4" class="cert-mark-cell">
                <div class="cert-mark-box">
                  <div class="cert-mark-symbol">[Mark]</div>
                  <div class="text-weight-bold"><span v-if="listing.hasCanada">C&nbsp;</span>US</div>
                  <div class="cert-mark-num">{{ certCustomer.listingNumber }}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="label-cell">Product<br />Description:</td>
              <td class="value-cell">{{ listing.description }}</td>
            </tr>
            <tr>
              <td class="label-cell">Model Numbers:</td>
              <td class="value-cell">
                <span v-if="listing.models.length">{{
                  listing.models.map((m) => m.modelNumber).join(', ')
                }}</span>
                <span v-else class="text-muted">None listed.</span>
              </td>
            </tr>
            <tr>
              <td class="label-cell">Listing<br />Conditions:</td>
              <td class="value-cell">
                <div
                  v-for="(cond, ci) in listing.listingConditions"
                  :key="ci"
                  class="condition-item"
                >
                  {{ ci + 1 }}. {{ cond }}
                </div>
                <span v-if="!listing.listingConditions.length" class="text-muted">None.</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- SIGNATURE BLOCK (last page only) -->
        <div v-if="index === approvedListings.length - 1" class="signature-block">
          <div class="sig-date-header">{{ signatureDate }}</div>
          <div class="sig-lines">
            <div class="sig-line-long"></div>
            <div class="sig-line-short"></div>
          </div>
          <div class="sig-labels">
            <div>Alona A. MacGregor, TEi-Listing Services Director</div>
            <div>Date</div>
          </div>
        </div>

        <div class="page-spacer"></div>

        <!-- FOOTER -->
        <footer class="doc-footer">
          <div class="footer-main">
            <div class="footer-accred">
              <img src="/A2LA_logo.jpg" alt="A2LA Accredited" class="accred-logo" />
              <div class="accred-label">PRODUCT<br />CERTIFICATION BODY<br />CERT #2946.01</div>
            </div>
            <div class="footer-legal">
              This Product Listing covers only those products under contract with TEi-Listing
              Services. No alteration to this document is authorized. Any reproductions shall be
              made in their entirety. TEi's trademark is registered, and its use is by contract or
              written permission only.<br /><br />
              ABUSE and/or IMPROPER USE OF THE PRODUCT VOIDS THE LISTING.<br /><br />
              The SCC Accreditation Symbol is an official symbol of the Standards Council of Canada,
              used under license.
            </div>
            <div class="footer-scc">
              <img src="/SCC_logo.png" alt="SCC Accredited" class="scc-logo" />
            </div>
          </div>
          <div class="footer-line">
            <span>F2046 &ndash; Listing Sheet</span>
            <span>Page {{ index + 1 }} of {{ approvedListings.length }}</span>
            <br />
            <span
              >Template Revision 20240723 &copy; Testing Engineers International, Inc&reg;.</span
            >
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useCertificationStore } from 'src/stores/certification-store';

const props = defineProps<{
  customerId: number;
}>();

const certStore = useCertificationStore();
const loading = ref(true);

const certCustomer = computed(() => certStore.certCustomer);

const approvedListings = computed(
  () => certCustomer.value?.listings.filter((l) => l.status === 'approved' && !l.archivedAt) ?? [],
);


function isoDate(date: Date | string | undefined): string {
  if (!date) return 'N/A';
  if (typeof date === 'string') return date.split('T')[0] ?? date;
  return date.toISOString().split('T')[0] ?? '';
}

const signatureDate = computed(() => {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
});

function doPrint() {
  window.print();
}

onMounted(async () => {
  try {
    await certStore.fetchCertificationCustomer(props.customerId);
  } finally {
    loading.value = false;
  }
});
</script>

<style>
@media print {
  @page {
    size: letter portrait;
    margin: 0.65in 0.75in 0.5in;
  }
  body {
    background: white !important;
    margin: 0;
    padding: 0;
  }
}
</style>

<style scoped>
* {
  box-sizing: border-box;
}

/* ── Print button bar ── */
.print-bar {
  background: #1a3a6b;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.print-btn {
  padding: 6px 18px;
  background: white;
  color: #1a3a6b;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
}

/* ── Status messages ── */
.status-msg {
  padding: 48px;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  color: #666;
  font-size: 14px;
}

/* ── Page ── */
.page {
  width: 8.5in;
  min-height: 11in;
  padding: 0.65in 0.75in 0.5in;
  margin: 20px auto;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9pt;
  color: #000;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.doc-header {
  margin-bottom: 14px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.doc-title {
  font-size: 2em;
  font-weight: bold;
  color: #1a3a6b;
  letter-spacing: 0.04em;
}

.address-bar {
  border-top: 1.5px solid #444;
  border-bottom: 1.5px solid #444;
  padding: 3px 0;
  text-align: center;
  font-size: 7.5pt;
}

/* ── Issued To ── */
.issued-section {
  margin: 14px 0;
}

.issued-top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.issued-label {
  white-space: nowrap;
  padding-top: 2px;
}

.issued-company {
  flex: 1;
  text-align: center;
  line-height: 1.5;
}

.company-name {
  font-weight: bold;
  font-size: 1.15em;
}

.listing-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 10px;
}

.listing-dates {
  text-align: right;
  line-height: 1.5;
}

/* ── Listing table ── */
.listing-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 6px;
}

.listing-table td {
  border: 1px solid #888;
  padding: 5px 7px;
  vertical-align: top;
  font-size: 8.5pt;
}

.section-header-row td {
  background: #cccccc;
  padding: 5px 8px;
}

.section-title {
  font-weight: bold;
  font-size: 9.5pt;
}

.cert-mark-header-cell {
  font-size: 8pt;
  white-space: nowrap;
  width: 90px;
}

.label-cell {
  width: 90px;
  font-size: 8pt;
  background: #f5f5f5;
  line-height: 1.4;
}

.value-cell {
  line-height: 1.5;
}

.cert-mark-cell {
  width: 90px;
  text-align: center;
  vertical-align: middle;
}

.cert-mark-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  border: 2px solid #1a3a6b;
  font-size: 8pt;
}

.cert-mark-symbol {
  font-size: 7pt;
  color: #888;
}

.cert-mark-num {
  font-weight: bold;
  font-size: 9pt;
  color: #1a3a6b;
}

.condition-item {
  margin: 2px 0;
}

.text-muted {
  color: #888;
}

/* ── Signature block ── */
.signature-block {
  margin-top: 36px;
}

.sig-date-header {
  text-align: right;
  font-weight: bold;
  margin-bottom: 28px;
}

.sig-lines {
  display: flex;
  gap: 20px;
  margin-bottom: 4px;
}

.sig-line-long,
.sig-line-short {
  border-bottom: 1px solid #000;
}

.sig-line-long {
  flex: 3;
}

.sig-line-short {
  flex: 1;
}

.sig-labels {
  display: flex;
  gap: 20px;
  font-size: 8pt;
}

.sig-labels div:first-child {
  flex: 3;
}

.sig-labels div:last-child {
  flex: 1;
}

/* ── Spacer ── */
.page-spacer {
  flex: 1;
}

/* ── Footer ── */
.doc-footer {
  margin-top: 14px;
  border-top: 1px solid #666;
}

.footer-main {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  align-items: flex-start;
}

.footer-accred {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 72px;
}

.accred-logo {
  height: 52px;
  width: auto;
}

.accred-label {
  font-size: 6.5pt;
  text-align: center;
  line-height: 1.4;
}

.footer-legal {
  flex: 1;
  font-size: 6.5pt;
  text-align: center;
  line-height: 1.4;
}

.footer-scc {
  min-width: 72px;
  display: flex;
  justify-content: center;
}

.scc-logo {
  height: 100px;
  width: auto;
}

.footer-line {
  border-top: 1px solid #aaa;
  padding-top: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 7pt;
}

/* ── Print overrides ── */
@media print {
  .page {
    width: 100%;
    min-height: unset;
    padding: 0;
    margin: 0;
    box-shadow: none;
  }

  .page-break {
    break-after: page;
  }

  .page:last-child {
    break-after: auto;
  }

  .page-spacer {
    flex: unset;
  }
}

/* ── Screen background ── */
@media screen {
  :root {
    background-color: #b0b0b0;
  }
}
</style>
