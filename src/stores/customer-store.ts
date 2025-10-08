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
    ) {
      await Promise.all([
        api.fetchCustomers(startRow, fetchCount, filter, sortBy, descending),
        api.fetchCustomerCount(filter),
        api.fetchCustomerCount(),
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

    // TODO: Everything from here down is subject to change when switching to a real API
    // Also will need functions to submit edits, etc. to the real API
    addCustomer(newCustomer: Customer) {
      newCustomer.id = this.customers.length + 1;
      this.customers.push(newCustomer);
      this.customers.sort((a, b) => a.name.localeCompare(b.name));
      return newCustomer.id; // so that we can immediately navigate to the new customer's detail page
    },
    addLocation(newLocation: CustomerLocation) {
      if (this.customer.locations) this.customer.locations.push(newLocation);
    },
    deleteLocation(index: number) {
      if (this.customer.locations) this.customer.locations.splice(index, 1);
    },
    addContact(newContact: CustomerContact) {
      if (this.customer.contacts) this.customer.contacts.push(newContact);
    },
    deleteContact(index: number) {
      if (this.customer.contacts) this.customer.contacts.splice(index, 1);
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
