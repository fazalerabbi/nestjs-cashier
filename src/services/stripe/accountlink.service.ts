import Stripe from 'stripe';
import { BaseService } from './base.service';
import {BadRequestException, Injectable} from "@nestjs/common";

@Injectable()
export class AccountLinkService extends BaseService {

        /**
         * Create a new account link in Stripe.
         * Stripe documentation for creating an account link: https://stripe.com/docs/api/account_links/create
         * @param accountId
         * @param options - The properties of the account link.
         * @returns {Promise<Stripe.AccountLink>} - The created account link object.
         * @throws {BadRequestException} - If the account ID is not provided.
         */
        public async create(accountId: string, options: Stripe.AccountLinkCreateParams = {} as Stripe.AccountLinkCreateParams): Promise<Stripe.AccountLink> {
            if (!accountId) {
                throw new BadRequestException('Account ID is required');
            }
            return await this.stripe.accountLinks.create({...options, account: accountId});
        }
}