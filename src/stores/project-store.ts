import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';
import type { Project, ProjectWithDetails } from 'src/components/Projects/models';

interface LookupItem {
  id: number;
  name: string;
}

export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [] as ProjectWithDetails[],
    project: null as ProjectWithDetails | null,
    allCustomers: [] as LookupItem[],
    projectTypes: [] as { label: string; value: string }[],
  }),

  actions: {
    async fetchProjects(filter?: string) {
      await api
        .fetchProjects(filter)
        .then((response) => {
          this.projects = response as ProjectWithDetails[];
        })
        .catch((error) => {
          console.error('Error fetching projects:', error);
        });
    },
    async fetchProject(projectId: number) {
      await api
        .fetchProject(projectId)
        .then((response) => {
          this.project = response as ProjectWithDetails;
        })
        .catch((error) => {
          console.error('Error fetching project:', error);
        });
    },
    async addProject(project: Omit<Project, 'id'>): Promise<number> {
      let newId = 0;
      await api
        .addProject(project)
        .then((created) => {
          const entry = created as ProjectWithDetails;
          this.projects.unshift(entry);
          newId = entry.id;
        })
        .catch((error) => {
          console.error('Error adding project:', error);
        });
      return newId;
    },
    async updateProject(project: Project) {
      await api
        .updateProject(project)
        .then(() => {
          const customerName =
            this.allCustomers.find((c) => c.id === project.customerId)?.name ?? 'Unknown';
          const updated: ProjectWithDetails = { ...project, customerName };
          this.project = updated;
          const index = this.projects.findIndex((p) => p.id === project.id);
          if (index !== -1) this.projects[index] = updated;
        })
        .catch((error) => {
          console.error('Error updating project:', error);
        });
    },
    async fetchProjectLookups() {
      await Promise.all([api.fetchAllCustomers(), api.fetchProjectTypes()])
        .then(([customers, types]) => {
          this.allCustomers = customers;
          this.projectTypes = types;
        })
        .catch((error) => {
          console.error('Error fetching project lookups:', error);
        });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot));
}
