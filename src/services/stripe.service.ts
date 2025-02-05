import { Injectable, Inject } from '@nestjs/common';
import {
    AccountLinkService,
    AccountService,
    CustomerService,
    PriceService,
    ProductService,
    SetupIntentService,
    SubscriptionService
} from './stripe';

@Injectable()
export class StripeService {
    constructor(
        @Inject(CustomerService) public customer: CustomerService,
        @Inject(PriceService) public price: PriceService,
        @Inject(ProductService) public product: ProductService,
        @Inject(SubscriptionService) public subscription: SubscriptionService,
        @Inject(SetupIntentService) public setupIntent: SetupIntentService,
        @Inject(AccountService) public account: AccountService,
        @Inject(AccountLinkService) public accountLink: AccountLinkService,
    ) {
    }
}
