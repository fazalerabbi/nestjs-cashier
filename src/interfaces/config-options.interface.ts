export interface NestjsCashierModuleOptions {
    secret: string;
    key?: string;
}

export interface NestjsCashierModuleAsyncOptions {
    useExisting?: any;
    useClass?: any;
    useFactory?: (...args: any[]) => Promise<NestjsCashierModuleOptions> | NestjsCashierModuleOptions;
    inject?: any[];
    imports?: any[];
}
