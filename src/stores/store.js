import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';

export const useCustomerStore = defineStore('customers', {
  state: () => ({
    customers: [],
  }),

  getters: {},

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
    addProject(newProject) {
      // can I mock an api call here like above?
      this.customers.unshift(newProject);
    },
    deleteProject(projectId) {
      // not sure if this works, but also not sure if I want the capability to delete customers at all
      this.customers = this.customers.splice((p) => p.id == projectId);
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
      // can I mock an api call here like above?
      this.projects.unshift(newProject);
    },
    deleteProject(projectId) {
      // not sure if this works, but also not sure if I want the capability to delete projects at all
      this.projects = this.projects.splice((p) => p.id == projectId);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot));
}
