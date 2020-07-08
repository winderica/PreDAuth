import { FC, useEffect, useState } from 'react';

interface Props {
    time: number;
    onTimeout: () => unknown;
}

export const Timer: FC<Props> = ({ time, onTimeout }) => {
    const [timeLeft, setTimeLeft] = useState(time);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeout();
            return;
        }
        setTimeout(() => {
            setTimeLeft(prevTime => prevTime - 1);
            console.log(timeLeft);
        }, 1000);
    });

    return timeLeft;
};
