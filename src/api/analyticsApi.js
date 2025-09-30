import apiClient from "./apiClient";

export const getPublicationsByMonth = (months = 12) =>
  apiClient.get(`/analytics/publications/by-month?months=${months}`).then(r => r.data);

export const getComparisonsByMonth = (months = 12) =>
  apiClient.get(`/analytics/comparisons/by-month?months=${months}`).then(r => r.data);

export const getUpcomingVaccines = (days = 30) =>
  apiClient.get(`/analytics/vaccines/upcoming?days=${days}`).then(r => r.data);
