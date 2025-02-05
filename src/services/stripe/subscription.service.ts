import Stripe from 'stripe';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { convertObjectToString } from '../../utils';

@Injectable()
export class SubscriptionService extends BaseService {

    /**
     * Create a new subscription in Stripe.
     * Stripe documentation for creating a subscription: https://stripe.com/docs/api/subscriptions/create
     *
     * @param {string} customerId - The ID of the customer to create the subscription for.
     * @param {Stripe.SubscriptionCreateParams} options - The subscription creation options.
     * @returns {Promise<Stripe.Subscription>} - The created subscription object.
     */
    public async create(customerId: string, options: Stripe.SubscriptionCreateParams = {} as Stripe.SubscriptionCreateParams): Promise<Stripe.Subscription> {
        if (!customerId) {
            throw new BadRequestException('Customer ID is required');
        }
        return await this.stripe.subscriptions.create({...options, customer: customerId});
    }

    /**
     * Update a subscription in Stripe.
     * Stripe documentation for updating a subscription: https://stripe.com/docs/api/subscriptions/update
     *
     * @param subscriptionId - The ID of the subscription to update.
     * @param options - The subscription update options.
     * @returns {Promise<Stripe.Subscription>} - The updated subscription object.
     * @throws {BadRequestException} - If the subscription ID is missing.
     */
    public async update(subscriptionId: string, options: Stripe.SubscriptionUpdateParams = {} as Stripe.SubscriptionUpdateParams): Promise<Stripe.Subscription> {
        if (!subscriptionId) {
            throw new BadRequestException('Subscription ID is required');
        }
        return await this.stripe.subscriptions.update(subscriptionId, options);
    }

    /**
     * Retrieve a subscription from Stripe.
     * Stripe documentation for retrieving a subscription: https://stripe.com/docs/api/subscriptions/retrieve
     *
     * @param subscriptionId - The ID of the subscription to retrieve.
     * @returns {Promise<Stripe.Subscription>} - The retrieved subscription object.
     * @throws {BadRequestException} - If the subscription ID is missing.
     */
    public async retrieve(subscriptionId: string): Promise<Stripe.Subscription> {
        if (!subscriptionId) {
            throw new BadRequestException('Subscription ID is required');
        }
        return await this.stripe.subscriptions.retrieve(subscriptionId);
    }

    /**
     * List subscriptions from Stripe.
     * Stripe documentation for listing subscriptions: https://stripe.com/docs/api/subscriptions/list
     *
     * @param options - The options to filter the list of subscriptions.
     * @returns {Promise<Stripe.ApiList<Stripe.Subscription>>}
     */
    public list(options: Stripe.SubscriptionListParams = {} as Stripe.SubscriptionListParams): Promise<Stripe.ApiList<Stripe.Subscription>> {
        return this.stripe.subscriptions.list(options);
    }

    /**
     * Cancel a subscription in Stripe.
     * Stripe documentation for canceling a subscription: https://stripe.com/docs/api/subscriptions/cancel
     *
     * @param subscriptionId - The ID of the subscription to cancel.
     * @param options - The options to cancel the subscription.
     * @returns {Promise<Stripe.Subscription>} - The canceled subscription object.
     * @throws {BadRequestException} - If the subscription ID is missing.
     */
    public async cancel(subscriptionId: string, options: Stripe.SubscriptionCancelParams = {} as Stripe.SubscriptionCancelParams): Promise<Stripe.Subscription> {
        if (!subscriptionId) {
            throw new BadRequestException('Subscription ID is required');
        }
        return await this.stripe.subscriptions.cancel(subscriptionId, options);
    }

    /**
     * Pause a subscription in Stripe.
     * Stripe documentation for pausing a subscription: https://stripe.com/docs/api/subscriptions/pause
     *
     * @param subscriptionId - The ID of the subscription to pause.
     * @param options - The options to pause the subscription.
     * @returns {Promise<Stripe.Subscription>} - The paused subscription object.
     * @throws {BadRequestException} - If the subscription ID is missing.
     */

    public async resume(subscriptionId: string, options: Stripe.SubscriptionUpdateParams = {} as Stripe.SubscriptionUpdateParams): Promise<Stripe.Subscription> {
        if (!subscriptionId) {
            throw new BadRequestException('Subscription ID is required');
        }
        return await this.stripe.subscriptions.resume(subscriptionId, options);
    }

    /**
     * Search for subscriptions in Stripe.
     * Stripe documentation for searching subscriptions: https://stripe.com/docs/api/subscriptions/search
     *
     * @param query - The options to search for subscriptions.
     * @param options - The options to filter the search results.
     * @returns {Promise<Stripe.ApiSearchResult<Stripe.Subscription>>}
     * @throws {BadRequestException} - If the options are not provided or invalid.
     */
    public async search(query: object, options: object = {}): Promise<Stripe.ApiSearchResult<Stripe.Subscription>> {
        if (!query) {
            throw new BadRequestException('Query is required');
        }
        const queryStr = convertObjectToString(query);
        return this.stripe.subscriptions.search({'query': queryStr, ...options});
    }

}