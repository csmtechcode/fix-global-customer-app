// src/features/services/api.ts
// Re-export service types and functions from the consolidated auth/api.ts
export type { ServiceCategory, Service, ServicesResponse, ServiceResponse } from "../auth/api";
export { getCategories, getServices, getServiceById, getServicesByCategory, searchServices } from "../auth/api";
