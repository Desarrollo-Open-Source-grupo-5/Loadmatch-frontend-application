export interface RegisterCarrierRequest {
  email: string;
  password: string;
  firstNames: string;
  lastNames: string;
  dni: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpirationDate: string;
  phoneNumber: string;
  operatingZone?: string;
}

