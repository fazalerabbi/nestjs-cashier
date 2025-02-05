import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { StripeService } from './services/stripe.service';
import { NestjsCashierModuleAsyncOptions, NestjsCashierModuleOptions } from './interfaces';
import {
    CustomerService,
    PriceService,
    ProductService,
    SubscriptionService
} from './services/stripe';

@Module({})
export class NestjsCashierModule {
    static forRootAsync(options: NestjsCashierModuleAsyncOptions): DynamicModule {
        const asyncProviders = this.createAsyncProviders(options);

        return {
            module: NestjsCashierModule,
            imports: options.imports || [],
            providers: [
                ...asyncProviders,
                {
                    provide: ConfigService,
                    useFactory: (options: NestjsCashierModuleOptions) => new ConfigService(options),
                    inject: [options.useExisting || options.useClass || 'NESTJS_CASHIER_OPTIONS'],
                },
                CustomerService,
                PriceService,
                ProductService,
                SubscriptionService,
                StripeService,
            ],
            exports: [StripeService],
        };
    }

    private static createAsyncProviders(options: NestjsCashierModuleAsyncOptions): Provider[] {
        if (options.useFactory) {
            return [
                {
                    provide: 'NESTJS_CASHIER_OPTIONS',
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
            ];
        }

        return [
            {
                provide: 'NESTJS_CASHIER_OPTIONS',
                useFactory: async (optionsFactory: any) => await optionsFactory.createNestCachierOptions(),
                inject: [options.useExisting || options.useClass],
            },
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
}
