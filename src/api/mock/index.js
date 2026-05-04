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
import employeeDocsJson from './data/employeedocs.json';
import employeeRolesJson from './data/employeeroles.json';
import trainingJson from './data/training.json';
import reviewsJson from './data/reviews.json';
import usersJson from './data/users.json';
import standardsJson from './data/standards.json';
import libraryCheckoutsJson from './data/librarycheckouts.json';

// Mutable in-memory copies so write operations work within the session
const standardsData = standardsJson.map((s) => ({ ...s, url: null }));
const libraryCheckoutsData = libraryCheckoutsJson.map((c) => ({ ...c }));
const projectsData = projectsJson.map((p) => ({ ...p }));
const rolesData = JSON.parse(JSON.stringify(rolesJson));
const legalDocsData = legalDocsJson.map((doc) => ({ ...doc, url: null }));
const employeeRolesData = employeeRolesJson.map((er) => ({ ...er }));
const trainingData = trainingJson.map((t) => ({ ...t, url: null }));
const employeeDocsData = employeeDocsJson.map((d) => ({ ...d, url: null }));
const reviewsData = reviewsJson.map((r) => ({ ...r }));
const personnelData = personnel.map((e) => ({ ...e }));
const usersData = usersJson.map((u) => ({ ...u }));

// In-memory password reset tokens keyed by lowercase email
const resetTokens = {};

const joinProject = (p) => ({
  ...p,
  customerName: customers.find((c) => c.id === p.customerId)?.name ?? 'Unknown',
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
  parent.children = roleData
    .filter((role) => parseInt(role.supervisor) === parseInt(parent.id))
    .sort((a, b) => a.title.localeCompare(b.title));
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
            p.jobNumber.toLowerCase().includes(filter.toLowerCase()) ||
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
      projectsData[index] = raw;
    }
    return Promise.resolve();
  },
  fetchAllCustomers() {
    return Promise.resolve(customers.map((c) => ({ id: c.id, name: c.name })));
  },
  fetchAllPersonnel() {
    return Promise.resolve(
      personnelData.map((e) => ({ id: e.id, name: `${e.firstName} ${e.lastName}` })),
    );
  },
  async fetchAllStandardNames() {
    const extractYear = (revision) => {
      const match = revision.match(/\d{4}/);
      return match ? parseInt(match[0]) : 0;
    };
    const latest = new Map();
    for (const s of standardsData) {
      const existing = latest.get(s.number);
      if (!existing || extractYear(s.revision) > extractYear(existing.revision)) {
        latest.set(s.number, s);
      }
    }
    const options = Array.from(latest.values()).map((s) => ({
      value: `${s.number} (${s.revision})`,
      label: `${s.number} (${s.revision}) — ${s.title}`,
      title: s.title,
    }));
    options.sort((a, b) =>
      a.value.localeCompare(b.value, undefined, { numeric: true, sensitivity: 'base' }),
    );
    return options;
  },

  async fetchPersonnel(startRow, fetchCount, filter, sortBy, descending) {
    // Fetch all employees, then filter, sort, and paginate the results
    return await fetch(personnelData, 1000)
      .then((response) => {
        const employeeArray = response;
        const fullName = (e) => `${e.lastName} ${e.firstName}`;
        const data = filter
          ? employeeArray.filter((row) =>
              `${row.firstName} ${row.lastName}`.toLowerCase().includes(filter.toLowerCase()),
            )
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
  addPersonnel(employee) {
    const id = personnelData.length ? Math.max(...personnelData.map((e) => e.id)) + 1 : 1;
    const entry = { ...employee, id };
    personnelData.push(entry);
    return Promise.resolve(entry);
  },
  addEmployeeRole(newAssignment) {
    const id = employeeRolesData.length ? Math.max(...employeeRolesData.map((er) => er.id)) + 1 : 1;
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
        ? employeeArray.filter((row) =>
            `${row.firstName} ${row.lastName}`.toLowerCase().includes(filter.toLowerCase()),
          )
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
      const annotate = (node) => {
        const assignedIds = employeeRolesData
          .filter((er) => er.roleId === node.id && !er.endDate)
          .map((er) => er.employeeId);
        node.assignedPersonnel = personnelData
          .filter((p) => assignedIds.includes(p.id))
          .map((p) => `${p.firstName} ${p.lastName}`)
          .sort((a, b) => a.localeCompare(b));
        node.children.forEach(annotate);
      };
      annotate(treeRoot);
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
  fetchEmployeeDocs(employeeId) {
    return fetch(
      employeeDocsData.filter((d) => d.employeeId === employeeId),
      500,
    );
  },
  addEmployeeDoc(doc) {
    const id = employeeDocsData.length ? Math.max(...employeeDocsData.map((d) => d.id)) + 1 : 1;
    const entry = { ...doc, id };
    employeeDocsData.unshift(entry);
    return Promise.resolve(entry);
  },
  deleteEmployeeDoc(id) {
    const index = employeeDocsData.findIndex((d) => d.id === id);
    if (index !== -1) employeeDocsData.splice(index, 1);
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

  login(email, password) {
    return fetch(usersData, 500).then((users) => {
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.active,
      );
      if (!user) throw new Error('Invalid email or password');
      const safeUser = { ...user };
      delete safeUser.password;
      return safeUser;
    });
  },

  fetchEmployeeRoleIds(employeeId) {
    const ids = employeeRolesData
      .filter((er) => er.employeeId === employeeId)
      .map((er) => er.roleId);
    return Promise.resolve(ids);
  },

  getCurrentUser(userId) {
    const user = usersData.find((u) => u.id === userId && u.active);
    if (!user) return Promise.resolve(null);
    const safeUser = { ...user };
    delete safeUser.password;
    return Promise.resolve(safeUser);
  },

  async requestPasswordReset(email) {
    const users = await fetch(usersData, 500);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.active);
    // Don't reveal whether the email exists — always return success
    if (!user) return { sent: true };
    const token = Math.random().toString(36).slice(2, 10).toUpperCase();
    resetTokens[email.toLowerCase()] = token;
    // In production this token would be emailed; expose it here for mock use only
    return { sent: true, _mockToken: token };
  },

  async resetPassword(email, token, newPassword) {
    const key = email.toLowerCase();
    if (!resetTokens[key] || resetTokens[key] !== token) {
      throw new Error('Invalid or expired reset token');
    }
    const index = usersData.findIndex((u) => u.email.toLowerCase() === key);
    if (index === -1) throw new Error('User not found');
    usersData[index] = { ...usersData[index], password: newPassword };
    delete resetTokens[key];
  },

  fetchAllStandardOptions() {
    const options = standardsData.map((s) => ({
      id: s.id,
      label: `${s.number} (${s.revision})`,
    }));
    options.sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }),
    );
    return Promise.resolve(options);
  },

  fetchCheckouts(filter) {
    const data = filter
      ? libraryCheckoutsData.filter((c) =>
          customers.find((cu) => cu.id === c.customerId)?.name.toLowerCase().includes(filter.toLowerCase()),
        )
      : libraryCheckoutsData.slice();
    data.sort((a, b) => b.checkoutDate.localeCompare(a.checkoutDate));
    return fetch(data, 500);
  },
  fetchCheckout(id) {
    return fetch(libraryCheckoutsData.find((c) => c.id === id) ?? null, 300);
  },
  addCheckout(checkout) {
    const id = libraryCheckoutsData.length ? Math.max(...libraryCheckoutsData.map((c) => c.id)) + 1 : 1;
    const entry = { ...checkout, id };
    libraryCheckoutsData.unshift(entry);
    return Promise.resolve(entry);
  },
  updateCheckout(checkout) {
    const index = libraryCheckoutsData.findIndex((c) => c.id === checkout.id);
    if (index !== -1) libraryCheckoutsData[index] = { ...checkout };
    return Promise.resolve();
  },

  changePassword(userId, currentPassword, newPassword) {
    const index = usersData.findIndex((u) => u.id === userId);
    if (index === -1) return Promise.reject(new Error('User not found'));
    if (usersData[index].password !== currentPassword) {
      return Promise.reject(new Error('Current password is incorrect'));
    }
    usersData[index] = { ...usersData[index], password: newPassword };
    return Promise.resolve();
  },

  fetchStandards(filter) {
    const data = filter
      ? standardsData.filter((s) => s.number.toLowerCase().includes(filter.toLowerCase()))
      : standardsData.slice();
    data.sort((a, b) => {
      b.number.localeCompare(a.number);
    });
    return fetch(data, 500);
  },

  updateStandard(standard) {
    const index = standardsData.findIndex((s) => s.id === standard.id);
    if (index !== -1) standardsData[index] = { ...standardsData[index], ...standard };
    return Promise.resolve();
  },

  addStandard(standard) {
    const id = standardsData.length ? Math.max(...standardsData.map((s) => s.id)) + 1 : 1;
    const entry = { ...standard, id, url: null };
    standardsData.push(entry);
    return Promise.resolve(entry);
  },

  uploadStandardDoc(id, filename, url) {
    const index = standardsData.findIndex((s) => s.id === id);
    if (index !== -1) standardsData[index] = { ...standardsData[index], filename, url };
    return Promise.resolve();
  },
};
