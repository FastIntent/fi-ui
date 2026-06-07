import { createContext } from 'react';

export interface RadioGroupContextProps {
  onChange: (e: import('./Radio').RadioChangeEvent) => void;
  value: unknown;
  disabled?: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextProps | null>(null);
