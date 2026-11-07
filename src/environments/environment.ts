/**
 * Production environment configuration.
 */
export const environment = {
  production: true,
  // Production API base URL.
  platformProviderApiBaseUrl: 'https://loadmatch-api.onrender.com/api/v1',
  // LoadMatch Platform (Spring Boot backend). Replace with the Azure App Service URL when it is deployed.
  platformApiBaseUrl: 'http://localhost:8080/api/v1',
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
