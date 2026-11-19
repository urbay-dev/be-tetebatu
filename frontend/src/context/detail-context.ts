import { createContext } from 'react';
export const DetailContext = createContext<(title: string) => void>(() => {});
