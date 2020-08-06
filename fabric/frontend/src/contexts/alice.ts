import { createContext } from 'react';

import { Alice } from '../utils/alice';

export const AliceContext = createContext<Alice>(undefined as unknown as Alice);
