import { Code } from '../constants/types';

export class CodeDB {
    code: { [id: string]: Code } = {};

    set(id: string, data: Code) {
        this.code[id] = data;
    }

    get(id: string) {
        return this.code[id];
    }

    del(id: string) {
        delete this.code[id];
    }
}
