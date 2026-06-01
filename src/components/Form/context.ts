import { createContext } from 'react';

export interface FormContextProps {
  requiredMark?: boolean | 'optional';
}

export const FormContext = createContext<FormContextProps>({});
