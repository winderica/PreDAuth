export class API {
    static root = 'https://predauth.com:4000';
    static register = (id) => `${this.root}/user/${id}`;
    static data = (id) => `${this.root}/user/${id}/data`;
    static backup = (id) => `${this.root}/user/${id}/backup`;
    static sendCode = (id, email) => `${this.root}/user/${id}/code/${email}`;
    static recoverByCode = (id) => `${this.root}/user/${id}/code`;
    static getGenerators = `${this.root}/auth/generators`;
    static getPKs = `${this.root}/auth/pks`;
    static reEncrypt = (id, redirect) => `${this.root}/auth/reEncrypt/${id}/${encodeURIComponent(redirect)}`;
}

export class STATE {
    static todo = 'TODO';
    static pending = 'PENDING';
    static done = 'DONE';
    static error = 'ERROR';
}
