import { useContext } from 'react';

import { AliceContext } from '../contexts';

export const useAlice = () => useContext(AliceContext);
