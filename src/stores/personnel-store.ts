import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';
import type {
  Employee,
  Role,
  LegalDocument,
  EmployeeDocument,
  EmployeeRoleWithDetails,
  Training,
  PerformanceReview,
} from 'src/components/Personnel/models';

export const usePersonnelStore = defineStore('personnel', {
  state: () => ({
    employees: [] as Employee[],
    totalEmployeeCount: 0,
    filteredEmployeeCount: 0,
    orgTree: <object[]>[],
    roleList: <number[]>[],
    allRoles: [] as Role[],
    employee: null as Employee | null,
    legalDocs: [] as LegalDocument[],
    employeeDocs: [] as EmployeeDocument[],
    trainingRecords: [] as Training[],
    reviews: [] as PerformanceReview[],
    personnelList: [] as { id: number; name: string }[],
  }),

  actions: {
    async fetchAllPersonnel() {
      await api
        .fetchAllPersonnel()
        .then((response: { id: number; name: string }[]) => {
          this.personnelList = response;
        })
        .catch((error) => {
          console.error('Error fetching personnel list:', error);
        });
    },
    async fetchPersonnel(
      startRow: number,
      fetchCount: number,
      filter: string,
      sortBy: string,
      descending: boolean,
    ) {
      await Promise.all([
        api.fetchPersonnel(startRow, fetchCount, filter, sortBy, descending),
        api.fetchPersonnelCount(filter),
        api.fetchPersonnelCount(),
      ])
        .then((responses) => {
          this.employees = responses[0];
          this.filteredEmployeeCount = responses[1];
          this.totalEmployeeCount = responses[2];
        })
        .catch((error) => {
          console.error('Error fetching personnel data:', error);
        });
    },
    async fetchOrg() {
      await api
        .fetchOrg()
        .then((response) => {
          this.orgTree = response[0];
          this.roleList = response[1];
          this.allRoles = response[2];
        })
        .catch((error) => {
          console.error('Error fetching org tree data:', error);
        });
    },
    async fetchEmployee(employeeId: number) {
      await api
        .fetchEmployee(employeeId)
        .then((response) => {
          this.employee = response ?? null;
        })
        .catch((error) => {
          console.error('Error fetching employee:', error);
        });
    },
    async addEmployeeRole(employeeId: number, roleId: number) {
      const newAssignment = {
        employeeId,
        roleId,
        startDate: new Date().toISOString().split('T')[0] as string,
        endDate: null,
        qualifications_verified_date: null,
        qualifications_verified_by: null,
        probation_verified_date: null,
        probation_verified_by: null,
      };
      await api
        .addEmployeeRole(newAssignment)
        .then((created) => {
          if (!this.employee) return;
          const role = this.allRoles.find((r) => r.id === roleId) ?? null;
          const entry: EmployeeRoleWithDetails = { ...created, role };
          this.employee.assignedRoles = [...(this.employee.assignedRoles ?? []), entry];
        })
        .catch((error) => {
          console.error('Error assigning role:', error);
        });
    },
    async removeEmployeeRole(assignmentId: number) {
      await api
        .removeEmployeeRole(assignmentId)
        .then(() => {
          if (!this.employee) return;
          this.employee.assignedRoles = (this.employee.assignedRoles ?? []).filter(
            (ar) => ar.id !== assignmentId,
          );
        })
        .catch((error) => {
          console.error('Error removing role assignment:', error);
        });
    },
    async fetchEmployeeDocs(employeeId: number) {
      await api
        .fetchEmployeeDocs(employeeId)
        .then((response) => {
          this.employeeDocs = response as EmployeeDocument[];
        })
        .catch((error) => {
          console.error('Error fetching employee documents:', error);
        });
    },
    async addEmployeeDoc(doc: Omit<EmployeeDocument, 'id'>) {
      await api
        .addEmployeeDoc(doc)
        .then((created) => {
          this.employeeDocs.unshift(created as EmployeeDocument);
        })
        .catch((error) => {
          console.error('Error adding employee document:', error);
        });
    },
    async deleteEmployeeDoc(id: number) {
      await api
        .deleteEmployeeDoc(id)
        .then(() => {
          this.employeeDocs = this.employeeDocs.filter((d) => d.id !== id);
        })
        .catch((error) => {
          console.error('Error deleting employee document:', error);
        });
    },
    async fetchTraining(employeeId: number) {
      await api
        .fetchTraining(employeeId)
        .then((response) => {
          this.trainingRecords = response as Training[];
        })
        .catch((error) => {
          console.error('Error fetching training records:', error);
        });
    },
    async addTraining(record: Omit<Training, 'id'>) {
      await api
        .addTraining(record)
        .then((created) => {
          this.trainingRecords.unshift(created as Training);
        })
        .catch((error) => {
          console.error('Error adding training record:', error);
        });
    },
    async fetchReviews(employeeId: number) {
      await api
        .fetchReviews(employeeId)
        .then((response) => {
          this.reviews = response as PerformanceReview[];
        })
        .catch((error) => {
          console.error('Error fetching reviews:', error);
        });
    },
    async addReview(review: Omit<PerformanceReview, 'id'>) {
      await api
        .addReview(review)
        .then((created) => {
          this.reviews.unshift(created as PerformanceReview);
        })
        .catch((error) => {
          console.error('Error adding review:', error);
        });
    },
    async verifyQualifications(assignmentId: number, verifiedBy: string) {
      const today = new Date().toISOString().split('T')[0] as string;
      await api
        .verifyQualifications(assignmentId, verifiedBy)
        .then(() => {
          if (!this.employee) return;
          const index = this.employee.assignedRoles?.findIndex((ar) => ar.id === assignmentId) ?? -1;
          const existing = this.employee.assignedRoles?.[index];
          if (index !== -1 && existing) {
            this.employee.assignedRoles![index] = {
              ...existing,
              qualifications_verified_date: today,
              qualifications_verified_by: verifiedBy,
            };
          }
        })
        .catch((error) => {
          console.error('Error verifying qualifications:', error);
        });
    },
    async verifyProbation(assignmentId: number, verifiedBy: string) {
      const today = new Date().toISOString().split('T')[0] as string;
      await api
        .verifyProbation(assignmentId, verifiedBy)
        .then(() => {
          if (!this.employee) return;
          const index = this.employee.assignedRoles?.findIndex((ar) => ar.id === assignmentId) ?? -1;
          const existing = this.employee.assignedRoles?.[index];
          if (index !== -1 && existing) {
            this.employee.assignedRoles![index] = {
              ...existing,
              probation_verified_date: today,
              probation_verified_by: verifiedBy,
            };
          }
        })
        .catch((error) => {
          console.error('Error verifying probation:', error);
        });
    },
    async fetchLegalDocs() {
      await api
        .fetchLegalDocs()
        .then((response) => {
          this.legalDocs = response as LegalDocument[];
        })
        .catch((error) => {
          console.error('Error fetching legal documents:', error);
        });
    },
    async uploadLegalDoc(id: number, file: File) {
      const url = URL.createObjectURL(file);
      const uploadDate = new Date().toISOString().split('T')[0] as string;
      await api
        .updateLegalDoc(id, file.name, uploadDate, url)
        .then(() => {
          const index = this.legalDocs.findIndex((d) => d.id === id);
          const existing = this.legalDocs[index];
          if (index !== -1 && existing) {
            this.legalDocs[index] = { ...existing, filename: file.name, uploadDate, url };
          }
        })
        .catch((error) => {
          console.error('Error uploading legal document:', error);
        });
    },
    async updateRole(role: Role) {
      await api
        .updateRole(role)
        .then(() => {
          const index = this.allRoles.findIndex((r) => r.id === role.id);
          if (index !== -1) this.allRoles[index] = { ...role };
        })
        .catch((error) => {
          console.error('Error updating role:', error);
        });
    },
    async addRole(role: Role) {
      await api
        .addRole(role)
        .then((created: Role) => {
          this.allRoles.push(created);
        })
        .catch((error: unknown) => {
          console.error('Error adding role:', error);
        });
    },
    async deleteRole(roleId: number) {
      await api
        .deleteRole(roleId)
        .then(() => {
          this.allRoles = this.allRoles.filter((r) => r.id !== roleId);
        })
        .catch((error) => {
          console.error('Error deleting role:', error);
        });
    },
    async updateEmployee(employee: Employee) {
      await api
        .updateEmployee(employee)
        .then(() => {
          this.employee = { ...employee };
          const index = this.employees.findIndex((e) => e.id === employee.id);
          if (index !== -1) this.employees[index] = { ...employee };
        })
        .catch((error: unknown) => {
          console.error('Error updating employee:', error);
        });
    },
    async addEmployee(newEmployee: Employee): Promise<number> {
      let newId = 0;
      await api
        .addPersonnel(newEmployee)
        .then((created) => {
          const employee = created as Employee;
          this.employees.push(employee);
          this.employees.sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
          newId = employee.id;
        })
        .catch((error) => {
          console.error('Error adding employee:', error);
        });
      return newId;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePersonnelStore, import.meta.hot));
}
