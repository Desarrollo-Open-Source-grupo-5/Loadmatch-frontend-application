/**
 * Development environment configuration.
 */
export const environment = {
  production: false,
  /*
  // API URL Version when the LoadMatch Platform (Spring Boot backend) is implemented

  platformProviderApiBaseUrl: 'http://localhost:8080/api/v1',
  */
  // API URL Version to be used until the LoadMatch Platform is implemented (json-server)
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
