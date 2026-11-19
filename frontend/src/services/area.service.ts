import api from './api';

export interface Area {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const areaService = {
  getAll: async (): Promise<Area[]> => {
    const response = await api.get('/v1/areas');
    return response.data.data;
  },
};
