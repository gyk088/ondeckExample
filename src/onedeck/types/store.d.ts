declare class Watchers {
    private _listeners: {[string]: (data: any) => void};
    constructor();
    public add(name: string, cb: (data: any) => void);
    public remove(name: string);
    public emit(data: {newValue: any, oldValue: any, state: any});
}

declare class Store {
    public state: object;
    public watchers: object;

    constructor(state: object);
}