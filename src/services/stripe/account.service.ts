import Stripe from 'stripe';
import { BaseService } from './base.service';
import {BadRequestException} from "@nestjs/common";

export class AccountService extends BaseService {

    /**
     * Create a new account in Stripe.
     * Stripe documentation for creating an account: https://stripe.com/docs/api/accounts/create
     * @param options - The properties of the account.
     * @returns {Promise<Stripe.Account>} - The created account object.
     */
    public async create(options: Stripe.AccountCreateParams = {} as Stripe.AccountCreateParams): Promise<Stripe.Account> {
        return await this.stripe.accounts.create(options);
    }

    /**
     * Update an account in Stripe.
     * Stripe documentation for updating an account: https://stripe.com/docs/api/accounts/update
     * @param {string} accountId - The ID of the account to update.
     * @param options - The properties to update.
     * @returns {Promise<Stripe.Account>} - The updated account object.
     * @throws {BadRequestException} - If the account ID is not provided.
     */
    public async update(accountId: string, options: Stripe.AccountUpdateParams = {} as Stripe.AccountUpdateParams): Promise<Stripe.Account> {
        if (!accountId) {
            throw new BadRequestException('Account ID is required');
        }
        return await this.stripe.accounts.update(accountId, options);
    }

    /**
     * Retrieve an account from Stripe.
     * Stripe documentation for retrieving an account: https://stripe.com/docs/api/accounts/retrieve
     * @param {string} accountId - The ID of the account to retrieve.
     * @returns {Promise<Stripe.Account>} - The retrieved account object.
     * @throws {BadRequestException} - If the account ID is not provided.
     */
    public async retrieve(accountId: string): Promise<Stripe.Account> {
        if (!accountId) {
            throw new BadRequestException('Account ID is required');
        }
        return await this.stripe.accounts.retrieve(accountId);
    }
}