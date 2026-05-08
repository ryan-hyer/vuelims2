import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';
import type {
  CertificationScheme,
  CertificationCategory,
  CertificationSubcategory,
  CertificationProductType,
  CertificationCustomerDetail,
} from 'src/components/Certification/models';

export interface FlatCertRow {
  rowType: 'category' | 'subcategory' | 'product';
  id: number;
  code: string;
  description: string;
  fee: number;
  totalFee?: number;
  standardIds?: number[];
}

export interface CertSchemeGroup {
  scheme: CertificationScheme;
  rows: FlatCertRow[];
}

export const useCertificationStore = defineStore('certification', {
  state: () => ({
    schemes: [] as CertificationScheme[],
    categories: [] as CertificationCategory[],
    subcategories: [] as CertificationSubcategory[],
    productTypes: [] as CertificationProductType[],
    certCustomer: null as CertificationCustomerDetail | null,
  }),

  getters: {
    rowsByScheme(state): CertSchemeGroup[] {
      return state.schemes.map((scheme) => {
        const rows: FlatCertRow[] = [];
        for (const cat of state.categories.filter((c) => c.schemeId === scheme.id)) {
          rows.push({ rowType: 'category', id: cat.id, code: cat.code, description: cat.description, fee: cat.fee });
          for (const sub of state.subcategories.filter((s) => s.categoryId === cat.id)) {
            rows.push({ rowType: 'subcategory', id: sub.id, code: `${cat.code}${sub.code}`, description: sub.description, fee: sub.fee });
            for (const pt of state.productTypes.filter((p) => p.subcategoryId === sub.id)) {
              rows.push({ rowType: 'product', id: pt.id, code: `${cat.code}${sub.code}${pt.code}`, description: pt.description, fee: pt.fee, totalFee: cat.fee + sub.fee + pt.fee, standardIds: pt.standardIds });
            }
          }
        }
        return { scheme, rows };
      });
    },
    flatRows(): FlatCertRow[] {
      return this.rowsByScheme.flatMap((g) => g.rows);
    },
  },

  actions: {
    async fetchCertificationCustomer(customerId: number) {
      this.certCustomer = null;
      const result = await api.fetchCertificationCustomer(customerId);
      this.certCustomer = result as CertificationCustomerDetail | null;
    },
    async fetchAll() {
      const [schemes, cats, subs, products] = await Promise.all([
        api.fetchCertificationSchemes(),
        api.fetchCertificationCategories(),
        api.fetchCertificationSubcategories(),
        api.fetchCertificationProductTypes(),
      ]);
      this.schemes = schemes as CertificationScheme[];
      this.categories = cats as CertificationCategory[];
      this.subcategories = subs as CertificationSubcategory[];
      this.productTypes = products as CertificationProductType[];
    },
    async updateCategory(data: CertificationCategory) {
      await api.updateCertificationCategory(data);
      const index = this.categories.findIndex((c) => c.id === data.id);
      if (index !== -1) this.categories[index] = { ...data };
    },
    async updateSubcategory(data: CertificationSubcategory) {
      await api.updateCertificationSubcategory(data);
      const index = this.subcategories.findIndex((s) => s.id === data.id);
      if (index !== -1) this.subcategories[index] = { ...data };
    },
    async updateProductType(data: CertificationProductType) {
      await api.updateCertificationProductType(data);
      const index = this.productTypes.findIndex((p) => p.id === data.id);
      if (index !== -1) this.productTypes[index] = { ...data };
    },
    async addCategory(data: Omit<CertificationCategory, 'id'>) {
      const result = await api.addCertificationCategory(data);
      this.categories.push(result as CertificationCategory);
    },
    async addSubcategory(data: Omit<CertificationSubcategory, 'id'>) {
      const result = await api.addCertificationSubcategory(data);
      this.subcategories.push(result as CertificationSubcategory);
    },
    async addProductType(data: Omit<CertificationProductType, 'id'>) {
      const result = await api.addCertificationProductType(data);
      this.productTypes.push(result as CertificationProductType);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCertificationStore, import.meta.hot));
}
