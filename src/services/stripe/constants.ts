import { StripeService } from '../stripe.service';
import { CustomerService } from './customer.service';
import { PriceService } from './price.service';
import { ProductService } from './product.service';
import { SubscriptionService } from './subscription.service';
import { ConfigService } from '../config.service';
import {SetupIntentService} from "./setupintent.service";
import {AccountService} from "./account.service";
import {AccountLinkService} from "./accountlink.service";

export const MockConfigService = { secret: 'test-key' };

export const TestModuleMetaData = {
    providers: [
        StripeService,
        CustomerService,
        PriceService,
        ProductService,
        SubscriptionService,
        SetupIntentService,
        AccountService,
        AccountLinkService,
        { provide: ConfigService, useValue: MockConfigService },
    ],
};