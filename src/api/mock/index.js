// This is a mock API, which should handle all logic normally handled by a real backend
// Altering the import call in the store(s) should be all that's needed to switch to the production API

import customers from './data/customers.json';
import customerlocations from './data/customerlocations.json';
import customercontacts from './data/customercontacts.json';
import customerinteractions from './data/customerinteractions.json';
import projects from './data/projects.json';
import personnel from './data/personnel.json';

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, time);
  });
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

  fetchProjects() {
    return fetch(projects, 1000);
  },

  async fetchPersonnel(startRow, fetchCount, filter, sortBy, descending) {
    // Fetch all employees, then filter, sort, and paginate the results
    return await fetch(personnel, 1000)
      .then((response) => {
        const employeeArray = response;
        const data = filter
          ? employeeArray.filter((row) => row.name.toLowerCase().includes(filter.toLowerCase()))
          : employeeArray.slice();
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
        console.error('Error in Mock API fetching employee list:', error);
      });
  },
  async fetchEmployee(employeeId) {
    // simulating a join query
    return await Promise.all([fetch(personnel, 1000)])
      .then((responses) => {
        const personnelData = responses[0];
        const employee = personnelData.find((c) => c.id === employeeId);
        return employee;
      })
      .catch((error) => {
        console.error('Error in Mock API fetching employee data:', error);
      });
  },
  async fetchPersonnelCount(filter) {
    // Fetch all employees, then filter and return the count
    return fetch(personnel).then((response) => {
      const employeeArray = response;
      const data = filter
        ? employeeArray.filter((row) => row.name.toLowerCase().includes(filter.toLowerCase()))
        : employeeArray.slice();
      return data.length;
    });
  },
};
