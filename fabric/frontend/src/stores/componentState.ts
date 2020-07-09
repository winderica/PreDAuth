import { action, observable } from 'mobx';

export class ComponentStateStore {
    @observable
    progressOn = false;

    @observable
    recovered = false;

    @action
    setProgress(on = true) {
        this.progressOn = on;
    }

    @action
    setRecovered(recovered = true) {
        this.recovered = recovered;
    }
}
