import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { App } from './views/App';
import 'mobx-react/batchingForReactDom';

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.querySelector('#root')
);
