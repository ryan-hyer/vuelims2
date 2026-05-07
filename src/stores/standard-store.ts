import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';
import type { Standard, StandardRevision } from 'src/components/Standards/models';

export type StandardWithLatestRevision = Standard & {
  revisionId?: number;
  revision?: string;
  url?: string;
  filename?: string;
};

interface StoreState {
  standards: Standard[];
  standardRevisions: StandardRevision[];
}

function extractYear(revision: string): number {
  const match = revision.match(/\d{4}/);
  return match ? parseInt(match[0]) : 0;
}

export const useStandardStore = defineStore('standards', {
  state: (): StoreState => ({
    standards: [],
    standardRevisions: [],
  }),

  getters: {
    latestStandards(state): StandardWithLatestRevision[] {
      const revisions: StandardRevision[] = state.standardRevisions;
      return state.standards.map((s) => {
        const stdRevisions = revisions
          .filter((r) => r.standardId === s.id)
          .sort((a, b) => extractYear(b.revision) - extractYear(a.revision));
        const latest: StandardRevision | undefined = stdRevisions[0];
        return {
          ...s,
          ...(latest
            ? { revisionId: latest.id, revision: latest.revision, url: latest.url, filename: latest.filename }
            : {}),
        };
      });
    },

    revisionsByNumber: (state) => (number: string): StandardRevision[] => {
      const revisions: StandardRevision[] = state.standardRevisions;
      const standard = state.standards.find((s) => s.number === number);
      if (!standard) return [];
      return revisions
        .filter((r) => r.standardId === standard.id)
        .sort((a, b) => extractYear(b.revision) - extractYear(a.revision));
    },
  },

  actions: {
    async fetchStandards(filter?: string) {
      await Promise.all([api.fetchStandards(filter), api.fetchStandardRevisions()])
        .then(([standards, revisions]) => {
          this.standards = standards as Standard[];
          this.standardRevisions = revisions as StandardRevision[];
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

    async addStandardRevision(data: Omit<StandardRevision, 'id'>): Promise<number> {
      let newId = 0;
      await api
        .addStandardRevision(data)
        .then((result) => {
          const r = result as StandardRevision;
          this.standardRevisions.push(r);
          newId = r.id;
        })
        .catch((error) => {
          console.error('Error adding standard revision:', error);
        });
      return newId;
    },

    async uploadDoc(revisionId: number, file: File) {
      const url = URL.createObjectURL(file);
      await api
        .uploadStandardDoc(revisionId, file.name, url)
        .then(() => {
          const revisions: StandardRevision[] = this.standardRevisions;
          const index = revisions.findIndex((r) => r.id === revisionId);
          if (index !== -1) {
            this.standardRevisions[index] = {
              ...revisions[index]!,
              filename: file.name,
              url,
            };
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
