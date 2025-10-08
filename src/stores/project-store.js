import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';

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
