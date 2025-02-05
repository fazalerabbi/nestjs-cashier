import Stripe from 'stripe';
import { Inject } from '@nestjs/common';
import { ConfigService } from '../config.service';

export class BaseService {
    protected stripe: Stripe;

    constructor(@Inject(ConfigService) private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.secret);
    }
}