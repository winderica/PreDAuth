export class API {
    static root = 'https://predauth.com:4000';
    static register = `${this.root}/user/register`;
    static data = (id) => `${this.root}/user/${id}/data`;
    static getGenerators = `${this.root}/auth/generators`;
    static reEncrypt = (id, redirect) => `${this.root}/auth/reEncrypt/${id}/${encodeURIComponent(redirect)}`;
}

export class STATE {
    static todo = 'TODO';
    static pending = 'PENDING';
    static done = 'DONE';
    static error = 'ERROR';
}
