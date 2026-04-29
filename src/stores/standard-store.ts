import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';
import type { Standard } from 'src/components/Standards/models';

function extractYear(revision: string): number {
  const match = revision.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

export const useStandardStore = defineStore('standards', {
  state: () => ({
    standards: [] as Standard[],
  }),

  getters: {
    latestStandards(state): Standard[] {
      const groups = new Map<string, Standard>();
      for (const s of state.standards) {
        const existing = groups.get(s.number);
        if (!existing || extractYear(s.revision) > extractYear(existing.revision)) {
          groups.set(s.number, s);
        }
      }
      return Array.from(groups.values());
    },
    revisionsByNumber: (state) => (number: string): Standard[] => {
      return state.standards
        .filter((s) => s.number === number)
        .sort((a, b) => extractYear(b.revision) - extractYear(a.revision));
    },
  },

  actions: {
    async fetchStandards(filter?: string) {
      await api
        .fetchStandards(filter)
        .then((response) => {
          this.standards = response as Standard[];
        })
        .catch((error) => {
          console.error('Error fetching standards:', error);
        });
    },
    async updateStandard(data: Standard) {
      await api
        .updateStandard(data)
        .then(() => {
          const index = this.standards.findIndex((s) => s.id === data.id);
          if (index !== -1) this.standards[index] = { ...this.standards[index], ...data };
        })
        .catch((error) => {
          console.error('Error updating standard:', error);
        });
    },

    async addStandard(data: Omit<Standard, 'id'>): Promise<number> {
      let newId = 0;
      await api
        .addStandard(data)
        .then((result) => {
          const s = result as Standard;
          this.standards.push(s);
          newId = s.id;
        })
        .catch((error) => {
          console.error('Error adding standard:', error);
        });
      return newId;
    },

    async uploadDoc(id: number, file: File) {
      const url = URL.createObjectURL(file);
      await api
        .uploadStandardDoc(id, file.name, url)
        .then(() => {
          const index = this.standards.findIndex((s) => s.id === id);
          if (index !== -1) {
            this.standards[index] = { ...this.standards[index]!, filename: file.name, url };
          }
        })
        .catch((error) => {
          console.error('Error uploading standard document:', error);
        });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStandardStore, import.meta.hot));
}
