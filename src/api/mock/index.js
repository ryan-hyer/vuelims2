// This is a mock API, which should handle all logic normally handled by a real backend
// Altering the import call in the store should be all that's needed to switch to the production API

import customers from './data/customers';
import customerlocations from './data/customerlocations';
import customercontacts from './data/customercontacts';
import customerinteractions from './data/customerinteractions';
import projects from './data/projects';

const fetch = (mockData, time = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, time);
  });
};

export default {
  fetchCustomers() {
    return fetch(customers, 1000);
  },
  async fetchCustomer(customerId) {
    // simulating a join query
    return Promise.all([
      fetch(customers, 1000),
      fetch(customerlocations),
      fetch(customercontacts),
      fetch(customerinteractions),
    ])
      .then((responses) => {
        const customer = responses[0].find((c) => c.id == customerId);
        customer.locations = responses[1].filter((l) => l.customerId == customerId);
        customer.contacts = responses[2].filter((c) => c.customerId == customerId);
        customer.interactions = responses[3].filter((i) => i.customerId == customerId);
        return customer;
      })
      .catch((error) => {
        console.error('Error in Mock API fetching customer data:', error);
      });
  },
  fetchProjects() {
    return fetch(projects, 1000);
  },
};
