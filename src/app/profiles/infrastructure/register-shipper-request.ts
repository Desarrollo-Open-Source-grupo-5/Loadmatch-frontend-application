export interface RegisterShipperRequest {
  email: string;
  password: string;
  ruc: string;
  businessName: string;
  contactName: string;
  phoneNumber: string;
  street: string;
  district: string;
  province?: string;
  department?: string;
}
