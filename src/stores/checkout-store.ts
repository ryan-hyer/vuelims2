import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';
import type { ProjectLibrary } from 'src/components/Projects/models';

interface LookupItem {
  id: number;
  name: string;
}

interface StandardOption {
  id: number;
  label: string;
}

export interface ProjectLibraryWithDetails extends ProjectLibrary {
  customerName: string;
}

export const useCheckoutStore = defineStore('checkouts', {
  state: () => ({
    checkouts: [] as ProjectLibraryWithDetails[],
    allCustomers: [] as LookupItem[],
    allStandards: [] as StandardOption[],
    allRevisions: [] as StandardOption[],
  }),

  actions: {
    async fetchCheckouts(filter?: string) {
      await Promise.all([
        api.fetchCheckouts(filter),
        api.fetchAllCustomers(),
        api.fetchAllStandardOptions(),
        api.fetchAllRevisionLabels(),
      ])
        .then(([raw, customers, standards, revisions]) => {
          this.allCustomers = customers as LookupItem[];
          this.allStandards = standards as StandardOption[];
          this.allRevisions = revisions as StandardOption[];
          this.checkouts = (raw as ProjectLibrary[]).map((c) => ({
            ...c,
            customerName: this.allCustomers.find((cu) => cu.id === c.customerId)?.name ?? 'Unknown',
          }));
        })
        .catch((error) => {
          console.error('Error fetching checkouts:', error);
        });
    },
    async fetchLookups() {
      await Promise.all([
        api.fetchAllCustomers(),
        api.fetchAllStandardOptions(),
        api.fetchAllRevisionLabels(),
      ])
        .then(([customers, standards, revisions]) => {
          this.allCustomers = customers as LookupItem[];
          this.allStandards = standards as StandardOption[];
          this.allRevisions = revisions as StandardOption[];
        })
        .catch((error) => {
          console.error('Error fetching checkout lookups:', error);
        });
    },
    async addCheckout(checkout: Omit<ProjectLibrary, 'id'>): Promise<number> {
      let newId = 0;
      await api
        .addCheckout(checkout)
        .then((created) => {
          const entry = created as ProjectLibrary;
          const customerName =
            this.allCustomers.find((c) => c.id === entry.customerId)?.name ?? 'Unknown';
          this.checkouts.unshift({ ...entry, customerName });
          newId = entry.id;
        })
        .catch((error) => {
          console.error('Error adding checkout:', error);
        });
      return newId;
    },
    async updateCheckout(checkout: ProjectLibrary) {
      await api
        .updateCheckout(checkout)
        .then(() => {
          const customerName =
            this.allCustomers.find((c) => c.id === checkout.customerId)?.name ?? 'Unknown';
          const updated: ProjectLibraryWithDetails = { ...checkout, customerName };
          const index = this.checkouts.findIndex((c) => c.id === checkout.id);
          if (index !== -1) this.checkouts[index] = updated;
        })
        .catch((error) => {
          console.error('Error updating checkout:', error);
        });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCheckoutStore, import.meta.hot));
}
