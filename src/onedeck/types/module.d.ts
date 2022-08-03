declare abstract class Module extends Observable {
    static private instances : {[string]: Module};

    public $$global: boolean;
    public $$gstore: object;
    public $$config: object;
    public $$mountId: string;
    public $$rootElementId: string;
    public $$layoutName: string;
    public $$embed: object;

    constructor();
    abstract init(path: Array<string>, state: object, queryParam: object): void;
    abstract dispatcher(path: Array<string>, state: object, queryParam: object): void;
    abstract mounted(currentModule: {name: string, obj: Module}, currentLayout: {name: string, obj: Module}): void;
    abstract eventHandler(): void;
    abstract destroy(): void;

    public $$route(routeData: {path: string; state: object}): void;
    public $$gemit(channel: string, data: any): void;
}