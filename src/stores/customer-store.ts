import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';
import type {
  Customer,
  CustomerLocation,
  CustomerContact,
  CustomerInteraction,
} from 'src/components/Customers/models';

export const useCustomerStore = defineStore('customers', {
  state: () => ({
    customers: [] as Customer[],
    totalCustomerCount: 0,
    filteredCustomerCount: 0,
    customer: {} as Customer,
  }),

  actions: {
    async fetchCustomers(
      startRow: number,
      fetchCount: number,
      filter: string,
      sortBy: string,
      descending: boolean,
      includeArchived = false,
    ) {
      await Promise.all([
        api.fetchCustomers(startRow, fetchCount, filter, sortBy, descending, includeArchived),
        api.fetchCustomerCount(filter, includeArchived),
        api.fetchCustomerCount('', false),
      ])
        .then((responses) => {
          this.customers = responses[0];
          this.filteredCustomerCount = responses[1];
          this.totalCustomerCount = responses[2];
        })
        .catch((error) => {
          console.error('Error fetching customer data:', error);
        });
    },
    async fetchCustomer(customerId: number) {
      return api
        .fetchCustomer(customerId)
        .then((response) => {
          this.customer = response;
        })
        .catch((error) => {
          console.error('Error fetching customer:', error);
        });
    },

    async archiveCustomer(customerId: number) {
      if (this.customer.id === customerId) this.customer.archivedAt = new Date().toISOString();
      const entry = this.customers.find((c) => c.id === customerId);
      if (entry) entry.archivedAt = new Date().toISOString();
      await api.archiveCustomer(customerId);
    },
    async restoreCustomer(customerId: number) {
      if (this.customer.id === customerId) delete this.customer.archivedAt;
      const entry = this.customers.find((c) => c.id === customerId);
      if (entry) delete entry.archivedAt;
      await api.restoreCustomer(customerId);
    },

    // TODO: Everything from here down is subject to change when switching to a real API
    // Also will need functions to submit edits, etc. to the real API
    updateCustomer(updatedCustomer: Customer) {
      Object.assign(this.customer, updatedCustomer);
      const entry = this.customers.find((c) => c.id === updatedCustomer.id);
      if (entry) Object.assign(entry, updatedCustomer);
    },
    addCustomer(newCustomer: Customer) {
      newCustomer.id = this.customers.length
        ? Math.max(...this.customers.map((c) => c.id)) + 1
        : 1;
      this.customers.push(newCustomer);
      this.customers.sort((a, b) => a.name.localeCompare(b.name));
      return newCustomer.id; // so that we can immediately navigate to the new customer's detail page
    },
    addLocation(newLocation: CustomerLocation) {
      if (this.customer.locations) {
        if (newLocation.isPrimary) {
          this.customer.locations.forEach((l) => (l.isPrimary = false));
        }
        this.customer.locations.push(newLocation);
      }
    },
    deleteLocation(index: number) {
      if (this.customer.locations) this.customer.locations.splice(index, 1);
    },
    archiveLocation(id: number) {
      const loc = this.customer.locations?.find((l) => l.id === id);
      if (loc) loc.archivedAt = new Date().toISOString();
    },
    restoreLocation(id: number) {
      const loc = this.customer.locations?.find((l) => l.id === id);
      if (loc) delete loc.archivedAt;
    },
    addContact(newContact: CustomerContact) {
      if (this.customer.contacts) this.customer.contacts.push(newContact);
    },
    deleteContact(index: number) {
      if (this.customer.contacts) this.customer.contacts.splice(index, 1);
    },
    archiveContact(id: number) {
      const c = this.customer.contacts?.find((c) => c.id === id);
      if (c) c.archivedAt = new Date().toISOString();
    },
    restoreContact(id: number) {
      const c = this.customer.contacts?.find((c) => c.id === id);
      if (c) delete c.archivedAt;
    },
    addInteraction(newInteraction: CustomerInteraction) {
      if (this.customer.interactions) this.customer.interactions.unshift(newInteraction);
    },
    deleteInteraction(index: number) {
      if (this.customer.interactions) this.customer.interactions.splice(index, 1);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCustomerStore, import.meta.hot));
}
