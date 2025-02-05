import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { BaseService } from './base.service';

@Injectable()
export class SetupIntentService extends BaseService {
    /**
     * Create a new setup intent in Stripe.
     * Stripe documentation for creating a setup intent: https://stripe.com/docs/api/setup_intents/create
     * @param options - The properties of the setup intent.
     * @returns {Promise<Stripe.SetupIntent>} - The created setup intent object.
     */
    public async create(options: Stripe.SetupIntentCreateParams = {} as Stripe.SetupIntentCreateParams): Promise<Stripe.SetupIntent> {
        return await this.stripe.setupIntents.create(options);
    }

    /**
     * Update a setup intent in Stripe.
     * Stripe documentation for updating a setup intent: https://stripe.com/docs/api/setup_intents/update
     * @param {string} setupIntentId - The ID of the setup intent to update.
     * @param options - The properties to update.
     * @returns {Promise<Stripe.SetupIntent>} - The updated setup intent object.
     * @throws {BadRequestException} - If the setup intent ID is not provided.
     */

    public async update(setupIntentId: string, options: Stripe.SetupIntentUpdateParams = {} as Stripe.SetupIntentUpdateParams): Promise<Stripe.SetupIntent> {
        if (!setupIntentId) {
            throw new BadRequestException('Setup intent ID is required');
        }
        return await this.stripe.setupIntents.update(setupIntentId, options);
    }

    /**
     * Retrieve a setup intent from Stripe.
     * Stripe documentation for retrieving a setup intent: https://stripe.com/docs/api/setup_intents/retrieve
     * @param {string} setupIntentId - The ID of the setup intent to retrieve.
     * @returns {Promise<Stripe.SetupIntent>} - The retrieved setup intent object.
     * @throws {BadRequestException} - If the setup intent ID is not provided.
     */
    public async retrieve(setupIntentId: string): Promise<Stripe.SetupIntent> {
        if (!setupIntentId) {
            throw new BadRequestException('Setup intent ID is required');
        }
        return await this.stripe.setupIntents.retrieve(setupIntentId);
    }

    /**
     * List setup intents from Stripe.
     * Stripe documentation for listing setup intents: https://stripe.com/docs/api/setup_intents/list
     * @param options - The options to filter the list of setup intents.
     * @returns {Promise<Stripe.ApiList<Stripe.SetupIntent>>}
     */
    public list(options: Stripe.SetupIntentListParams = {} as Stripe.SetupIntentListParams): Promise<Stripe.ApiList<Stripe.SetupIntent>> {
        return this.stripe.setupIntents.list(options);
    }

    /**
     * Cancel a setup intent in Stripe.
     * Stripe documentation for canceling a setup intent: https://stripe.com/docs/api/setup_intents/cancel
     * @param {string} setupIntentId - The ID of the setup intent to cancel.
     * @param options - The properties to cancel.
     * @returns {Promise<Stripe.SetupIntent>} - The canceled setup intent object.
     * @throws {BadRequestException} - If the setup intent ID is not provided.
     */

    public async cancel(setupIntentId: string, options: Stripe.SetupIntentCancelParams = {} as Stripe.SetupIntentCancelParams): Promise<Stripe.SetupIntent> {
        if (!setupIntentId) {
            throw new BadRequestException('Setup intent ID is required');
        }
        return await this.stripe.setupIntents.cancel(setupIntentId, options);
    }

    /**
     * Confirm a setup intent in Stripe.
     * Stripe documentation for confirming a setup intent: https://stripe.com/docs/api/setup_intents/confirm
     * @param {string} setupIntentId - The ID of the setup intent to confirm.
     * @param options - The properties to confirm.
     * @returns {Promise<Stripe.SetupIntent>} - The confirmed setup intent object.
     * @throws {BadRequestException} - If the setup intent ID is not provided.
     */
    public async confirm(setupIntentId: string, options: Stripe.SetupIntentConfirmParams = {} as Stripe.SetupIntentConfirmParams): Promise<Stripe.SetupIntent> {
        if (!setupIntentId) {
            throw new BadRequestException('Setup intent ID is required');
        }
        return await this.stripe.setupIntents.confirm(setupIntentId, options);
    }

    public async verifyMicrodeposits(setupIntentId: string, options: Stripe.SetupIntentVerifyMicrodepositsParams = {} as Stripe.SetupIntentVerifyMicrodepositsParams): Promise<Stripe.SetupIntent> {
        if (!setupIntentId) {
            throw new BadRequestException('Setup intent ID is required');
        }
        return await this.stripe.setupIntents.confirm(setupIntentId, options);
    }
}