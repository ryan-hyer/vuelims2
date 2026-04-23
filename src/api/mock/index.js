// This is a mock API, which should handle all logic normally handled by a real backend
// Altering the import call in the store(s) should be all that's needed to switch to the production API

import customers from './data/customers.json';
import customerlocations from './data/customerlocations.json';
import customercontacts from './data/customercontacts.json';
import customerinteractions from './data/customerinteractions.json';
import projectsJson from './data/projects.json';
import personnel from './data/personnel.json';
import rolesJson from './data/roles.json';
import legalDocsJson from './data/legaldocs.json';
import employeeRolesJson from './data/employeeroles.json';
import trainingJson from './data/training.json';
import reviewsJson from './data/reviews.json';

// Mutable in-memory copies so write operations work within the session
const projectsData = projectsJson.map((p) => ({ ...p }));
const rolesData = JSON.parse(JSON.stringify(rolesJson));
const legalDocsData = legalDocsJson.map((doc) => ({ ...doc, url: null }));
const employeeRolesData = employeeRolesJson.map((er) => ({ ...er }));
const trainingData = trainingJson.map((t) => ({ ...t, url: null }));
const reviewsData = reviewsJson.map((r) => ({ ...r }));
const personnelData = personnel.map((e) => ({ ...e }));

const joinProject = (p) => ({
  ...p,
  customerName: customers.find((c) => c.id === p.customerId)?.name ?? 'Unknown',
  assignedEmployeeName: (() => { const e = personnelData.find((e) => e.id === p.assignedEmployeeId); return e ? `${e.firstName} ${e.lastName}` : null; })(),
});

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, time);
  });
};

const findChildren = (parent, roleData) => {
  // iterate through the roleData object to transform the flat JSON into a hierarchy usable by the Quasar Tree component
  parent.children = roleData.filter((role) => parseInt(role.supervisor) === parseInt(parent.id));
  parent.children.forEach((child) => {
    findChildren(child, roleData);
  });
  return parent;
};

export default {
  async fetchCustomers(startRow, fetchCount, filter, sortBy, descending) {
    // Fetch all customers, then filter, sort, and paginate the results
    return await fetch(customers, 1000)
      .then((response) => {
        const customerArray = response;
        const data = filter
          ? customerArray.filter((row) => row.name.toLowerCase().includes(filter.toLowerCase()))
          : customerArray.slice();
        if (sortBy) {
          // In this case, sortBy can only be 'name' (the only column in the table)
          const sortFn = descending
            ? (a, b) => (a.name > b.name ? -1 : a.name < b.name ? 1 : 0)
            : (a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
          data.sort(sortFn);
        }
        return data.slice(startRow, startRow + fetchCount);
      })
      .catch((error) => {
        console.error('Error in Mock API fetching customer list:', error);
      });
  },
  async fetchCustomerCount(filter) {
    // Fetch all customers, then filter and return the count
    return fetch(customers).then((response) => {
      const customerArray = response;
      const data = filter
        ? customerArray.filter((row) => row.name.toLowerCase().includes(filter.toLowerCase()))
        : customerArray.slice();
      return data.length;
    });
  },
  async fetchCustomer(customerId) {
    // simulating a join query
    return await Promise.all([
      fetch(customers, 1000),
      fetch(customerlocations),
      fetch(customercontacts),
      fetch(customerinteractions),
    ])
      .then((responses) => {
        const customersData = responses[0];
        const locationsData = responses[1];
        const contactsData = responses[2];
        const interactionsData = responses[3];

        const customer = customersData.find((c) => c.id === customerId);
        if (customer) {
          customer.locations = locationsData.filter((l) => l.customerId === customerId);
          customer.contacts = contactsData.filter((c) => c.customerId === customerId);
          customer.interactions = interactionsData.filter((i) => i.customerId === customerId);
        }
        return customer;
      })
      .catch((error) => {
        console.error('Error in Mock API fetching customer data:', error);
      });
  },

  fetchProjects(filter) {
    const withDetails = projectsData.map(joinProject);
    const data = filter
      ? withDetails.filter(
          (p) =>
            p.number.toLowerCase().includes(filter.toLowerCase()) ||
            p.customerName.toLowerCase().includes(filter.toLowerCase()) ||
            p.description.toLowerCase().includes(filter.toLowerCase()),
        )
      : withDetails.slice();
    data.sort((a, b) => {
      if (!a.completeDate && b.completeDate) return -1;
      if (a.completeDate && !b.completeDate) return 1;
      return b.startDate.localeCompare(a.startDate);
    });
    return fetch(data, 500);
  },
  fetchProject(projectId) {
    const p = projectsData.find((p) => p.id === projectId);
    return fetch(p ? joinProject(p) : null, 300);
  },
  addProject(project) {
    const id = projectsData.length ? Math.max(...projectsData.map((p) => p.id)) + 1 : 1;
    const entry = { ...project, id };
    projectsData.unshift(entry);
    return Promise.resolve(joinProject(entry));
  },
  updateProject(project) {
    const index = projectsData.findIndex((p) => p.id === project.id);
    if (index !== -1) {
      const raw = { ...project };
      delete raw.customerName;
      delete raw.assignedEmployeeName;
      projectsData[index] = raw;
    }
    return Promise.resolve();
  },
  fetchAllCustomers() {
    return Promise.resolve(customers.map((c) => ({ id: c.id, name: c.name })));
  },
  fetchAllPersonnel() {
    return Promise.resolve(personnelData.map((e) => ({ id: e.id, name: `${e.firstName} ${e.lastName}` })));
  },

  async fetchPersonnel(startRow, fetchCount, filter, sortBy, descending) {
    // Fetch all employees, then filter, sort, and paginate the results
    return await fetch(personnelData, 1000)
      .then((response) => {
        const employeeArray = response;
        const fullName = (e) => `${e.lastName} ${e.firstName}`;
        const data = filter
          ? employeeArray.filter((row) => `${row.firstName} ${row.lastName}`.toLowerCase().includes(filter.toLowerCase()))
          : employeeArray.slice();
        if (sortBy) {
          const sortFn = descending
            ? (a, b) => fullName(b).localeCompare(fullName(a))
            : (a, b) => fullName(a).localeCompare(fullName(b));
          data.sort(sortFn);
        }
        return data.slice(startRow, startRow + fetchCount);
      })
      .catch((error) => {
        console.error('Error in Mock API fetching employee list:', error);
      });
  },
  async fetchEmployee(employeeId) {
    return await Promise.all([
      fetch(personnelData, 1000),
      fetch(employeeRolesData),
      fetch(rolesData),
    ])
      .then((responses) => {
        const empList = responses[0];
        const empRoles = responses[1];
        const allRoles = responses[2];

        const employee = empList.find((e) => e.id === employeeId);
        if (employee) {
          employee.assignedRoles = empRoles
            .filter((er) => er.employeeId === employeeId)
            .map((er) => ({ ...er, role: allRoles.find((r) => r.id === er.roleId) ?? null }));
        }
        return employee;
      })
      .catch((error) => {
        console.error('Error in Mock API fetching employee data:', error);
      });
  },
  updateEmployee(employee) {
    const index = personnelData.findIndex((e) => e.id === employee.id);
    if (index !== -1) personnelData[index] = { ...employee };
    return Promise.resolve();
  },
  addEmployeeRole(newAssignment) {
    const id = employeeRolesData.length
      ? Math.max(...employeeRolesData.map((er) => er.id)) + 1
      : 1;
    const entry = { ...newAssignment, id };
    employeeRolesData.push(entry);
    return Promise.resolve(entry);
  },
  removeEmployeeRole(assignmentId) {
    const index = employeeRolesData.findIndex((er) => er.id === assignmentId);
    if (index !== -1) employeeRolesData.splice(index, 1);
    return Promise.resolve();
  },
  async fetchPersonnelCount(filter) {
    // Fetch all employees, then filter and return the count
    return fetch(personnelData).then((response) => {
      const employeeArray = response;
      const data = filter
        ? employeeArray.filter((row) => `${row.firstName} ${row.lastName}`.toLowerCase().includes(filter.toLowerCase()))
        : employeeArray.slice();
      return data.length;
    });
  },
  async fetchOrg() {
    return fetch(rolesData, 1000).then((response) => {
      const roleArray = response;
      const root = roleArray.find((r) => r.supervisor === null);
      if (!root) throw new Error('No root role found in org data');
      const treeRoot = { ...root, children: [] };
      findChildren(treeRoot, roleArray);
      const roleList = roleArray.map((r) => r.id);
      return [[treeRoot], roleList, roleArray];
    });
  },
  async fetchLegalDocs() {
    return fetch(legalDocsData, 500);
  },
  updateLegalDoc(id, filename, uploadDate, url) {
    const index = legalDocsData.findIndex((d) => d.id === id);
    if (index !== -1) legalDocsData[index] = { ...legalDocsData[index], filename, uploadDate, url };
    return Promise.resolve();
  },
  fetchTraining(employeeId) {
    return fetch(
      trainingData.filter((t) => t.employeeId === employeeId),
      500,
    );
  },
  addTraining(record) {
    const id = trainingData.length ? Math.max(...trainingData.map((t) => t.id)) + 1 : 1;
    const entry = { ...record, id };
    trainingData.unshift(entry);
    return Promise.resolve(entry);
  },
  fetchReviews(employeeId) {
    return fetch(
      reviewsData.filter((r) => r.employeeId === employeeId),
      500,
    );
  },
  addReview(review) {
    const id = reviewsData.length ? Math.max(...reviewsData.map((r) => r.id)) + 1 : 1;
    const entry = { ...review, id };
    reviewsData.unshift(entry);
    return Promise.resolve(entry);
  },
  verifyQualifications(assignmentId, verifiedBy) {
    const today = new Date().toISOString().split('T')[0];
    const index = employeeRolesData.findIndex((er) => er.id === assignmentId);
    if (index !== -1)
      employeeRolesData[index] = {
        ...employeeRolesData[index],
        qualifications_verified_date: today,
        qualifications_verified_by: verifiedBy,
      };
    return Promise.resolve();
  },
  verifyProbation(assignmentId, verifiedBy) {
    const today = new Date().toISOString().split('T')[0];
    const index = employeeRolesData.findIndex((er) => er.id === assignmentId);
    if (index !== -1)
      employeeRolesData[index] = {
        ...employeeRolesData[index],
        probation_verified_date: today,
        probation_verified_by: verifiedBy,
      };
    return Promise.resolve();
  },
  updateRole(updatedRole) {
    const index = rolesData.findIndex((r) => r.id === updatedRole.id);
    if (index !== -1) rolesData[index] = { ...updatedRole };
    return Promise.resolve();
  },
  addRole(role) {
    const id = rolesData.length ? Math.max(...rolesData.map((r) => r.id)) + 1 : 1;
    const entry = { ...role, id };
    rolesData.push(entry);
    return Promise.resolve(entry);
  },
  deleteRole(roleId) {
    const index = rolesData.findIndex((r) => r.id === roleId);
    if (index !== -1) rolesData.splice(index, 1);
    return Promise.resolve();
  },
};
