import customers from './data/customers';
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
    return fetch(customers, 1000); // wait 1s before returning posts
  },
  fetchProjects() {
    return fetch(projects, 1000); // wait 1s before returning posts
  },
};
