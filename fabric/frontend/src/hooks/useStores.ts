import { useContext } from 'react';

import { StoresContext } from '../contexts';

export const useStores = () => useContext(StoresContext);
