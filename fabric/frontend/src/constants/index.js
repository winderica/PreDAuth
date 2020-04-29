// fabric backend
export class API {
    static root = 'http://127.0.0.1:4000';
    static register = `${this.root}/user/register`;
    static data = (id) => `${this.root}/user/${id}/data`;
    static getGenerators = (id) => `${this.root}/auth/generators/${id}`;
    static reEncrypt = (id, redirect) => `${this.root}/auth/reEncrypt/${id}/${encodeURIComponent(redirect)}`;
}
