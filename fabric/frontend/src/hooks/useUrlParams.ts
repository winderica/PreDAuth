import { useLocation } from '@reach/router';

export const useUrlParams = <T>(key: string) => {
    const { search } = useLocation();
    const res = new URLSearchParams(search).get(key);
    if (!res) {
        return undefined;
    }
    try {
        return JSON.parse(res) as T;
    } catch {
        return undefined;
    }
};
