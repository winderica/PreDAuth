import { Backup } from '../constants/types';

export class BackupDB {
    backup: { [id: string]: Backup } = {};

    set(id: string, data: Backup) {
        this.backup[id] = data;
    }

    get(id: string) {
        return this.backup[id];
    }

    del(id: string) {
        delete this.backup[id];
    }
}
