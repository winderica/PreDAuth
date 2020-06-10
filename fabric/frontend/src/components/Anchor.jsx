import React from 'react';
import { Link } from '@reach/router';

export const Anchor = ({ to, children }) => (
    <Link
        to={to}
        style={{
            textDecoration: 'none',
            outline: 'none',
            color: 'inherit',
        }}
    >
        {children}
    </Link>
);
