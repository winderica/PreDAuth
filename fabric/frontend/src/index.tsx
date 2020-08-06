import React, { StrictMode } from 'react';
import { render } from 'react-dom';

import 'mobx-react/batchingForReactDom';

import { App } from './views/App';

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.querySelector('#root')
);
