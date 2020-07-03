import { useLocation } from '@reach/router';

export const useUrlParams = (key) => {
    const location = useLocation();
    try {
        return JSON.parse(new URLSearchParams(location.search).get(key));
    } catch {
        return undefined;
    }
};
