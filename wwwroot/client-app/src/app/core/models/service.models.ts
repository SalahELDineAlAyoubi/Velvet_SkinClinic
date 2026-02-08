 export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  sessionsNumber: number;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  sessionsNumber: number;
}

export interface UpdateServiceRequest {
  name: string;
  description?: string;
  price: number;
  sessionsNumber: number;
}
