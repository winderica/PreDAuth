import { observable, action } from 'mobx';

export class IdentityStore {
    @observable
    id = '';

    @action
    set(id) {
        this.id = id;
    }
}
