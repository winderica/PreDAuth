export type ClassValue = string | number | { [id: string]: boolean | undefined | null; } | Array<ClassValue> | undefined | null | false;

export const classNames: (...classes: ClassValue[]) => string = (...args) => {
    const classes = [];
    for (const arg of args) {
        if (!arg) continue;
        if (typeof arg === 'string' || typeof arg === 'number') {
            classes.push(arg);
        } else if (Array.isArray(arg)) {
            if (arg.length) {
                const inner = classNames(...arg);
                if (inner) {
                    classes.push(inner);
                }
            }
        } else if (typeof arg === 'object') {
            if (arg.toString !== Object.prototype.toString) {
                classes.push(arg.toString());
            } else {
                for (const key in arg) {
                    if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
                        classes.push(key);
                    }
                }
            }
        }
    }
    return classes.join(' ');
};
