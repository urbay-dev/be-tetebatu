import api from './api';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  shortDescription?: string;
  shortDescriptionEn?: string;
  categoryId: string;
  areaId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  directions?: string;
  directionsEn?: string;
  openingHours?: any;
  vehicleType?: string;
  passengerCapacity?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured: boolean;
  isRecommended: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: any;
  area?: any;
  images?: any[];
  contacts?: any[];
  facilities?: any[];
  features?: any[];
  prices?: any[];
}

export interface ServiceContact {
  type: 'WHATSAPP' | 'PHONE' | 'EMAIL' | 'WEBSITE' | 'INSTAGRAM' | 'FACEBOOK' | 'OTHER';
  label?: string;
  value: string;
  isPrimary: boolean;
}

export interface ServiceFacility {
  name: string;
  nameEn: string;
  icon?: string;
}

export interface ServiceFeature {
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
}

export interface ServicePrice {
  label: string;
  labelEn: string;
  type: 'FIXED' | 'RANGE' | 'STARTING_FROM' | 'FREE' | 'CONTACT_FOR_PRICE';
  minPrice?: number;
  maxPrice?: number;
  currency: string;
  unit?: string;
  unitEn?: string;
}

export interface CreateServiceInput {
  name: string;
  slug?: string;
  description?: string;
  descriptionEn?: string;
  shortDescription?: string;
  shortDescriptionEn?: string;
  categoryId: string;
  areaId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  directions?: string;
  directionsEn?: string;
  openingHours?: any;
  vehicleType?: string;
  passengerCapacity?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured?: boolean;
  isRecommended?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  contacts?: ServiceContact[];
  facilities?: ServiceFacility[];
  features?: ServiceFeature[];
  prices?: ServicePrice[];
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {}

export const serviceService = {
  getAll: async (): Promise<Service[]> => {
    const response = await api.get('/v1/services/admin');
    return response.data.data;
  },

  getById: async (id: string): Promise<Service> => {
    const response = await api.get(`/v1/services/admin/${id}`);
    return response.data.data;
  },

  create: async (data: CreateServiceInput): Promise<Service> => {
    const response = await api.post('/v1/services/admin', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateServiceInput): Promise<Service> => {
    const response = await api.patch(`/v1/services/admin/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/v1/services/admin/${id}`);
  },

  uploadImage: async (id: string, file: File, alt?: string, altEn?: string): Promise<any> => {
    const body = new FormData();
    body.append('image', file);
    if (alt) body.append('alt', alt);
    if (altEn) body.append('altEn', altEn);
    const response = await api.post(`/v1/services/admin/${id}/images`, body);
    return response.data.data;
  },

  deleteImage: async (id: string, imageId: string): Promise<void> => {
    await api.delete(`/v1/services/admin/${id}/images/${imageId}`);
  },

  setPrimaryImage: async (id: string, imageId: string): Promise<any> => {
    const response = await api.patch(`/v1/services/admin/${id}/images/${imageId}/primary`);
    return response.data.data;
  },
};
