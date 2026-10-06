/**
 * Production environment configuration.
 */
export const environment = {
  production: true,
  // Production API base URL.
  platformProviderApiBaseUrl: 'http://localhost:3000/api/v1',
  platformProviderShippersEndpointPath: '/shippers',
  platformProviderCarriersEndpointPath: '/carriers',
  platformProviderVehicleTypesEndpointPath: '/vehicle-types',
  platformProviderVehiclesEndpointPath: '/vehicles',
  platformProviderLoadRequestsEndpointPath: '/load-requests',
  platformProviderTripsEndpointPath: '/trips',
  platformProviderDocumentsEndpointPath: '/documents',
  platformProviderDocumentTypesEndpointPath: '/document-types',
};
