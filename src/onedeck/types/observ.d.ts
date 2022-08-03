interface IListeners {
    channel: {[string]: IChanel } ;
}

interface IChanel {
    data: Array<(data: any) => void>;
    eventProperty: {isOnOnce: boolean}
}

declare class Observable {
    private _listeners : IListeners
    constructor();
    public $$on(channel: string, cb:(data: any) => void): void;
    public $$onOnce(channel: string, cb:(data: any) => void): void;
    public $$off(channel: string, cb:(data: any) => void): void;
    public $$offAll(): void;
    public $$emit(channel: string, data: any): void;
    public install(extendObj: object): void;
}