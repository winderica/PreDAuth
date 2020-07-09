export type ClassValue = string | number | Array<ClassValue> | undefined | null | false;

export const classNames = (...args: ClassValue[]) => {
    return args.flat().filter(Boolean).join(' ');
};
