import { Injectable } from '@nestjs/common';
import { NestjsCashierModuleOptions } from '../interfaces/config-options.interface';

@Injectable()
export class ConfigService {
    constructor(private options: NestjsCashierModuleOptions) {}

    get key(): string {
        return this.options.key;
    }

    get secret(): string {
        return this.options.secret;
    }
}
