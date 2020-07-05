import React, { FC } from 'react';
import { Link } from '@reach/router';

interface Props {
    to: string;
}

export const Anchor: FC<Props> = ({ to, children }) => (
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
