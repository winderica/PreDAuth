import { action, observable } from 'mobx';

export class ComponentStateStore {
    @observable
    progressOn = false;

    @action
    setProgress(on: boolean) {
        this.progressOn = on;
    }
}
