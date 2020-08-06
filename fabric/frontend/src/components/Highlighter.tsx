import { highlightBlock } from 'highlight.js';
import React, { FC, useEffect, useRef } from 'react';

import { useStyles } from '../styles/highlighter';

interface Props {
    language: string;
}

export const Highlighter: FC<Props> = ({ language, children }) => {
    const codeNode = useRef<HTMLElement>(null);
    const classes = useStyles();
    useEffect(() => {
        codeNode.current && highlightBlock(codeNode.current);
    });
    return (
        <pre className={classes.pre}>
            <code ref={codeNode} className={language}>{children}</code>
        </pre>
    );
};
