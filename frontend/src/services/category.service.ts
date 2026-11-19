import api from './api';

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  nameEn?: string;
  slug?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/v1/categories/admin');
    return response.data.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/v1/categories/admin/${id}`);
    return response.data.data;
  },

  create: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await api.post('/v1/categories/admin', {...data, nameEn: data.nameEn || data.name});
    return response.data.data;
  },

  update: async (id: string, data: UpdateCategoryInput): Promise<Category> => {
    const response = await api.patch(`/v1/categories/admin/${id}`, {...data, ...(data.nameEn !== undefined ? {nameEn:data.nameEn || data.name} : {})});
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/v1/categories/admin/${id}`);
  },
};
