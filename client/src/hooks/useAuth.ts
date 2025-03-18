// client/src/hooks/useAuth.ts
// هوک دسترسی به کانتکست احراز هویت

import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
