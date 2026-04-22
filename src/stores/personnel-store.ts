import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/mock';
import type { Employee, Role } from 'src/components/Personnel/models';

export const usePersonnelStore = defineStore('personnel', {
  state: () => ({
    employees: [] as Employee[],
    totalEmployeeCount: 0,
    filteredEmployeeCount: 0,
    orgTree: <object[]>[],
    roleList: <string[]>[],
    allRoles: [] as Role[],
    employee: {} as Employee,
  }),

  actions: {
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
          this.employee = response;
        })
        .catch((error) => {
          console.error('Error fetching employee:', error);
        });
    },
    addEmployee(newEmployee: Employee) {
      newEmployee.id = this.employees.length + 1;
      this.employees.push(newEmployee);
      this.employees.sort((a, b) => a.name.localeCompare(b.name));
      return newEmployee.id; // so that we can immediately navigate to the new employee's detail page
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePersonnelStore, import.meta.hot));
}
