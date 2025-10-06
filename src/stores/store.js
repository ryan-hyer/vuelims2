import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';

export const useCustomerStore = defineStore('customers', {
  state: () => ({
    customers: [],
    customer: { id: -1, name: '' }, // having a default object avoids a pesky error in CustomerDetail, but is there a better way?
  }),

  actions: {
    async fetchCustomers() {
      return api
        .fetchCustomers()
        .then((response) => {
          this.customers = response;
        })
        .catch((error) => {
          console.error('Error fetching customers:', error);
        });
    },
    async fetchCustomer(customerId) {
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
    addCustomer(newCustomer) {
      newCustomer.id = this.customers.length + 1;
      this.customers.push(newCustomer);
      this.customers.sort((a, b) => a.name.localeCompare(b.name));
      return newCustomer.id; // so that we can immediately navigate to the new customer's detail page
    },
    addLocation(newLocation) {
      this.customer.locations.push(newLocation);
    },
    deleteLocation(index) {
      this.customer.locations.splice(index, 1);
    },
    addContact(newContact) {
      this.customer.contacts.push(newContact);
    },
    deleteContact(index) {
      this.customer.contacts.splice(index, 1);
    },
    addInteraction(newInteraction) {
      this.customer.interactions.unshift(newInteraction);
    },
    deleteInteraction(index) {
      this.customer.interactions.splice(index, 1);
    },
  },
});

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [],
  }),

  getters: {},

  actions: {
    async fetchProjects() {
      return api
        .fetchProjects()
        .then((response) => {
          this.projects = response;
        })
        .catch((error) => {
          console.error('Error fetching projects:', error);
        });
    },
    addProject(newProject) {
      this.projects.unshift(newProject);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot));
}
