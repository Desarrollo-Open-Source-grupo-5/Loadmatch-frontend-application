/**
 * Production environment configuration.
 */
export const environment = {
  production: true,
  // JSON Server mock API hosted on Render.
  platformProviderApiBaseUrl: 'https://loadmatch-api.onrender.com/api/v1',
  // LoadMatch Platform (Spring Boot backend) hosted on Render.
  platformApiBaseUrl: 'https://loadmatch-backend-application.onrender.com/api/v1',
  platformTokensEndpointPath: '/tokens',
  platformProviderShippersEndpointPath: '/shippers',
  platformProviderCarriersEndpointPath: '/carriers',
  platformProviderVehicleTypesEndpointPath: '/vehicle-types',
  platformProviderVehiclesEndpointPath: '/vehicles',
  platformProviderLoadRequestsEndpointPath: '/load-requests',
  platformProviderTripsEndpointPath: '/trips',
  platformProviderDocumentsEndpointPath: '/documents',
  platformProviderDocumentTypesEndpointPath: '/document-types',
};
