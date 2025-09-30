import apiClient from "./apiClient";

// === Reportes “clásicos” (los 3 primeros que ya tenías) ===
export const getPublicationsByMonth = (months = 12) =>
  apiClient.get(`/stats/publications/by-month?months=${months}`).then(r => r.data);

export const getComparisonsByMonth = (months = 12) =>
  apiClient.get(`/stats/comparisons/by-month?months=${months}`).then(r => r.data);

export const getUpcomingVaccines = (days = 30) =>
  apiClient.get(`/stats/vaccines/upcoming?days=${days}`).then(r => r.data);

// === Crecimiento & Engagement ===
export const getUsersByMonth = (months = 12) =>
  apiClient.get(`/stats/growth/users-by-month?months=${months}`).then(r => r.data);

export const getActivityByMonth = (months = 12) =>
  apiClient.get(`/stats/growth/activity?months=${months}`).then(r => r.data);

export const getRetentionCohorts = (cohorts = 6, periods = 3) =>
  apiClient.get(`/stats/growth/retention-cohorts?cohorts=${cohorts}&periods=${periods}`).then(r => r.data);

// === Adopción & Riesgo ===
export const getAdoptionFunnel = () =>
  apiClient.get(`/stats/adoption/funnel`).then(r => r.data);

export const getRiskProfiles = () =>
  apiClient.get(`/stats/risk/profiles`).then(r => r.data);
//Cantidad total
export const getUsersTotal = (onlyEnabled = true) =>
  apiClient.get(`/stats/growth/users-total?onlyEnabled=${onlyEnabled}`)
    .then(r => r.data);

export const getOrgsTotals = (onlyEnabled = true) =>
  apiClient.get(`/stats/orgs/totals?onlyEnabled=${onlyEnabled}`).then(r => r.data);

